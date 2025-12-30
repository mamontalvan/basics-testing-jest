
import { error } from "console";
import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { ReservationsDataAccess } from "../../../app/server_app/data/ReservationsDataAccess";
import { LoginHandler } from "../../../app/server_app/handlers/LoginHandler";
import { RegisterHandler } from "../../../app/server_app/handlers/RegisterHandler";
import { ReservationsHandler } from "../../../app/server_app/handlers/ReservationsHandler";
import { HTTP_CODES } from "../../../app/server_app/model/ServerModel";
import { Server } from "../../../app/server_app/server/Server";

const requestMock = {
    headers: {
        'user-agent': 'jest-test'
    },
    url: 'jest-url'
}

const responseMock = {
    end: jest.fn(),
    writeHead: jest.fn()
}

const serverMock = {
    listen: jest.fn(),
    close: jest.fn(),
}

jest.mock('http', ()=>({
    createServer: (cb: Function) => {
        cb(requestMock, responseMock);
        return serverMock;
    }
}));

jest.mock("../../../app/server_app/auth/Authorizer");
jest.mock("../../../app/server_app/data/ReservationsDataAccess");
jest.mock("../../../app/server_app/handlers/RegisterHandler");
jest.mock("../../../app/server_app/handlers/LoginHandler");
jest.mock("../../../app/server_app/handlers/ReservationsHandler");

describe('Server test suit', () => {
    let sut: Server;

    beforeEach(() => {
        sut = new Server();
        expect(Authorizer).toHaveBeenCalledTimes(1);
        expect(ReservationsDataAccess).toHaveBeenCalledTimes(1);
    });

    afterEach(()=>{
        jest.clearAllMocks();
    });

    it('should start server on port 8080 and "end method" was called', async ()=>{
        await sut.startServer();
        expect(responseMock.end).toHaveBeenCalled();
        expect(serverMock.listen).toHaveBeenCalledWith(8080);
    });

    it('should start server on port 8080 and "end method" was called', async ()=>{
        await sut.startServer();
        expect(responseMock.end).toHaveBeenCalled();
        expect(serverMock.listen).toHaveBeenCalledWith(8080);
    });

    it('should handle register request', async ()=>{
        requestMock.url = 'localhost:8080/register';
        const handleRequestSpy = jest.spyOn(RegisterHandler.prototype, 'handleRequest');

        await sut.startServer();

        expect(handleRequestSpy).toHaveBeenCalledTimes(1);
        expect(RegisterHandler).toHaveBeenCalledWith(requestMock, responseMock, expect.any(Authorizer));
    });

    it('should handle login request', async ()=>{
        requestMock.url = 'localhost:8080/login';
        const handleRequestSpy = jest.spyOn(LoginHandler.prototype, 'handleRequest');

        await sut.startServer();

        expect(handleRequestSpy).toHaveBeenCalledTimes(1);
        expect(LoginHandler).toHaveBeenCalledWith(requestMock, responseMock, expect.any(Authorizer));
    });

    it('should handle reservation request', async ()=>{
        requestMock.url = 'localhost:8080/reservation';
        const handleRequestSpy = jest.spyOn(ReservationsHandler.prototype, 'handleRequest');

        await sut.startServer();

        expect(handleRequestSpy).toHaveBeenCalledTimes(1);
        expect(ReservationsHandler).toHaveBeenCalledWith(requestMock, responseMock, expect.any(Authorizer), expect.any(ReservationsDataAccess));
    });

    it('should do nothing for not supported routes', async ()=>{
        requestMock.url = 'localhost:8080/someRandomRoute';
        const validateTokenSpy = jest.spyOn(Authorizer.prototype, 'validateToken');

        await sut.startServer();

        expect(validateTokenSpy).not.toHaveBeenCalled();
    });

    it('should handle errors in serving request', async ()=> {
        requestMock.url = 'localhost:8080/reservation';
        const handleRequestSpy = jest.spyOn(ReservationsHandler.prototype, 'handleRequest');
        handleRequestSpy.mockRejectedValueOnce(new Error('Some Error here'));

        await sut.startServer();

        expect(responseMock.writeHead).toHaveBeenCalledWith(
            HTTP_CODES.INTERNAL_SERVER_ERROR,
            JSON.stringify(`Internal server error: Some Error here`)
        );
    });

    it('should stop the server if started', async ()=>{
        serverMock.close.mockImplementation(cb => cb());
        
        await sut.startServer();
        const actual = await sut.stopServer();
    
        expect(serverMock.close).toHaveBeenCalledTimes(1);
        expect(actual).toBeUndefined();
    });

    it('should throw error if server has a problem when stop it', async ()=>{
        const error = new Error('close failed');
        serverMock.close.mockImplementation(cb => cb(error));
        
        await sut.startServer();
        await expect(sut.stopServer()).rejects.toThrow('close failed');
    });

    it('should return undefined if not exist server', async ()=>{
        expect(await sut.stopServer()).toBeUndefined();
    });
});
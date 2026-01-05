import { DataBase } from "../../app/server_app/data/DataBase";
import { HTTP_CODES, HTTP_METHODS } from "../../app/server_app/model/ServerModel";
import { Server } from "../../app/server_app/server/Server";
import { RequestTestWrapper } from './test_utils/RequestTestWrapper';
import { ResponseTestWrapper } from './test_utils/ResponseTestWrapper';

jest.mock("../../app/server_app/data/DataBase");
jest.mock("http", ()=>({
    createServer: (cb: Function) =>{
        cb(requestTestWrapper, responseTestWrapper);
        return fakeServer;
    }
}));

const requestTestWrapper = new RequestTestWrapper();
const responseTestWrapper = new ResponseTestWrapper();
const fakeServer = {
    listen: ()=>{},
    close: ()=>{},
};

describe('Register requests test suit', ()=>{
    const fakeUser = '123';

    beforeEach(()=>{
        requestTestWrapper.headers = {'user-agent': 'jest-test'};
        requestTestWrapper.url = 'localhost:8080/register';
    });

    afterEach(()=>{
        requestTestWrapper.clearFields();
        responseTestWrapper.clearFields();
        jest.clearAllMocks();
    });

    it('should register new users', async ()=>{
        requestTestWrapper.method = HTTP_METHODS.POST;
        requestTestWrapper.body = {
            userName: 'someUserName',
            password: 'somePassword',
        };
        jest.spyOn(DataBase.prototype, 'insert').mockResolvedValueOnce(fakeUser);

        await new Server().startServer();

        await new Promise(process.nextTick) // this solves timing issues

        expect(responseTestWrapper.statusCode).toBe(HTTP_CODES.CREATED);
        expect(responseTestWrapper.body).toEqual(expect.objectContaining({
            userId: expect.any(String)
        }))
    });

    it('should reject request witho no userName and password', async ()=>{
        requestTestWrapper.method = HTTP_METHODS.POST;
        requestTestWrapper.body = { };

        await new Server().startServer();

        await new Promise(process.nextTick) // this solves timing issues

        expect(responseTestWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
        expect(responseTestWrapper.body).toBe('userName and password required')
    });    

    it('should do nothing for not supported method', async ()=>{
        requestTestWrapper.method = HTTP_METHODS.PUT;

        await new Server().startServer();

        await new Promise(process.nextTick) // this solves timing issues

        expect(responseTestWrapper.statusCode).toBeUndefined();
        expect(responseTestWrapper.body).toBeUndefined();
    });     
});
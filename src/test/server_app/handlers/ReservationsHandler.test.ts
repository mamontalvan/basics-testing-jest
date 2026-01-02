import { IncomingMessage, ServerResponse } from "http";
import { ReservationsHandler } from "../../../app/server_app/handlers/ReservationsHandler";
import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { ReservationsDataAccess } from "../../../app/server_app/data/ReservationsDataAccess";
import { HTTP_CODES, HTTP_METHODS } from "../../../app/server_app/model/ServerModel";
import { Reservation } from "../../../app/server_app/model/ReservationModel";

const getRequestBodyMock = jest.fn();

jest.mock("../../../app/server_app/utils/Utils", () => ({
    getRequestBody: () => getRequestBodyMock()
}));

describe('ReservationsHandler suit test', ()=>{
    let sut: ReservationsHandler;
    const fakeTokenId = '1234';
    const fakeReservationId = '567';

    const someReservation: Reservation = {
        id: '',
        room: 'someRoom',
        user: 'someUser',
        startDate: '2025-01-01',
        endDate: '2025-02-01'
    };    

    const requestMock = {
        method: undefined, 
        headers: {
            authorization: undefined,
        },
        url: undefined,
    }

    const responseMock = {
        statusCode: 0,
        writeHead: jest.fn(),
        write: jest.fn()
    }

    const authorizerMock = {
        validateToken: jest.fn()
    }

    const reservationsDataAccessMock = {
        createReservation: jest.fn(),
        getAllReservations: jest.fn(),
        getReservation: jest.fn(),
        updateReservation: jest.fn(),
        deleteReservation: jest.fn(),
    }

    beforeEach(()=>{
        sut = new ReservationsHandler(
            requestMock as any as IncomingMessage,
            responseMock as any as ServerResponse,
            authorizerMock as any as Authorizer,
            reservationsDataAccessMock as any as ReservationsDataAccess
        );
    });

    afterEach(()=>{
        jest.clearAllMocks();
    });

    it('should validate operation is not valid', async ()=>{
        const actual = await sut.handleRequest();

        expect(actual).toBeUndefined();
        expect(responseMock.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
        expect(responseMock.write)
            .toHaveBeenCalledWith(JSON.stringify('Unauthorized operation!'));
    });

    it('should validate operation is not valid', async()=>{
        requestMock.headers.authorization = fakeTokenId;
        authorizerMock.validateToken.mockResolvedValueOnce(false);

        const actual = await sut.handleRequest();

        expect(actual).toBeUndefined();
        expect(responseMock.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
        expect(responseMock.write)
            .toHaveBeenCalledWith(JSON.stringify('Unauthorized operation!'));        
    });
    
    it('should validate request is not valid', async ()=> {
        requestMock.headers.authorization = fakeTokenId;
        requestMock.method = HTTP_METHODS.POST;
        authorizerMock.validateToken.mockResolvedValueOnce(true);        
        getRequestBodyMock.mockResolvedValueOnce({});

        const actual = await sut.handleRequest();
        
        expect(actual).toBeUndefined();
        expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
        expect(responseMock.write)
            .toHaveBeenCalledWith(JSON.stringify('Incomplete reservation!'));
    });
    
    it('should validate request is valid', async()=>{
        requestMock.headers.authorization = fakeTokenId;
        requestMock.method = HTTP_METHODS.POST;
        authorizerMock.validateToken.mockResolvedValueOnce(true);        
        getRequestBodyMock.mockResolvedValueOnce(someReservation);
        reservationsDataAccessMock.createReservation.mockResolvedValueOnce(fakeReservationId);
        
        const actual = await sut.handleRequest();

        expect(actual).toBeUndefined();
        expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
        expect(responseMock.write)
            .toHaveBeenCalledWith(JSON.stringify({ reservationId: fakeReservationId } ));
    });
});
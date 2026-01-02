import { IncomingMessage, ServerResponse } from "http";
import { ReservationsHandler } from "../../../app/server_app/handlers/ReservationsHandler";
import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { ReservationsDataAccess } from "../../../app/server_app/data/ReservationsDataAccess";
import {
  HTTP_CODES,
  HTTP_METHODS,
} from "../../../app/server_app/model/ServerModel";
import { Reservation } from "../../../app/server_app/model/ReservationModel";

const getRequestBodyMock = jest.fn();

jest.mock("../../../app/server_app/utils/Utils", () => ({
  getRequestBody: () => getRequestBodyMock(),
}));

describe("ReservationsHandler suit test", () => {
  let sut: ReservationsHandler;
  const fakeTokenId = "1234";
  const fakeReservationId = "567";
  const fakeReservation: Reservation = {
    id: fakeReservationId,
    fakeField: "fakeField",
  } as any as Reservation;
  const someReservation: Reservation = {
    id: "",
    room: "someRoom",
    user: "someUser",
    startDate: "2025-01-01",
    endDate: "2025-02-01",
  };

  const someReservation2: Reservation = {
    id: "",
    room: "someRoom2",
    user: "someUser2",
    startDate: "2024-01-01",
    endDate: "2024-02-01",
  };

  const requestMock = {
    method: undefined,
    headers: {
      authorization: undefined,
    },
    url: undefined,
  };

  const responseMock = {
    statusCode: 0,
    writeHead: jest.fn(),
    write: jest.fn(),
  };

  const authorizerMock = {
    validateToken: jest.fn(),
  };

  const reservationsDataAccessMock = {
    createReservation: jest.fn(),
    getAllReservations: jest.fn(),
    getReservation: jest.fn(),
    updateReservation: jest.fn(),
    deleteReservation: jest.fn(),
  };

  beforeEach(() => {
    sut = new ReservationsHandler(
      requestMock as any as IncomingMessage,
      responseMock as any as ServerResponse,
      authorizerMock as any as Authorizer,
      reservationsDataAccessMock as any as ReservationsDataAccess
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return unauthorized for invalid token", async () => {
    const actual = await sut.handleRequest();

    expect(actual).toBeUndefined();
    expect(responseMock.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
    expect(responseMock.write).toHaveBeenCalledWith(
      JSON.stringify("Unauthorized operation!")
    );
  });

  it("should return unauthorized for unauthorized operation", async () => {
    requestMock.headers.authorization = fakeTokenId;
    authorizerMock.validateToken.mockResolvedValueOnce(false);

    const actual = await sut.handleRequest();

    expect(actual).toBeUndefined();
    expect(responseMock.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
    expect(responseMock.write).toHaveBeenCalledWith(
      JSON.stringify("Unauthorized operation!")
    );
  });

  it('should return undefined for invalid method', async()=>{
    requestMock.headers.authorization = fakeTokenId;
    authorizerMock.validateToken.mockResolvedValueOnce(true);
    requestMock.method = 'INVALID';

    expect(await sut.handleRequest()).toBeUndefined();

  });

  describe("POST request", () => {
    beforeEach(()=>{
      requestMock.headers.authorization = fakeTokenId;
      requestMock.method = HTTP_METHODS.POST;
    });

    it("should not create reservation from empty request", async () => {
      authorizerMock.validateToken.mockResolvedValueOnce(true);
      getRequestBodyMock.mockResolvedValueOnce({});

      const actual = await sut.handleRequest();

      expect(actual).toBeUndefined();
      expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseMock.write)
            .toHaveBeenCalledWith(JSON.stringify("Incomplete reservation!"));
    });

    it("should not create reservation from invalid request", async () => {
      authorizerMock.validateToken.mockResolvedValueOnce(true);
      getRequestBodyMock.mockResolvedValueOnce(fakeReservation);

      const actual = await sut.handleRequest();

      expect(actual).toBeUndefined();
      expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseMock.write)
            .toHaveBeenCalledWith(JSON.stringify("Incomplete reservation!"));
    });    

    it("should create reservation from valid request", async () => {
      authorizerMock.validateToken.mockResolvedValueOnce(true);
      getRequestBodyMock.mockResolvedValueOnce(someReservation);
      reservationsDataAccessMock.createReservation.mockResolvedValueOnce(
        fakeReservationId
      );

      const actual = await sut.handleRequest();

      expect(actual).toBeUndefined();
      expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
      expect(responseMock.write).toHaveBeenCalledWith(
        JSON.stringify({ reservationId: fakeReservationId })
      );
    });
  });

  describe("GET request", () => {
    beforeEach(() => {
      requestMock.headers.authorization = fakeTokenId;
      requestMock.method = HTTP_METHODS.GET;
    });

    it("should return not found for non existing id", async () => {
      authorizerMock.validateToken.mockResolvedValueOnce(true);
      requestMock.url = `localhost:8080/reservation/${fakeReservationId}`;
      reservationsDataAccessMock.getReservation.mockResolvedValueOnce(
        undefined
      );

      const actual = await sut.handleRequest();

      expect(actual).toBeUndefined();
      expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND);
      expect(responseMock.write).toHaveBeenCalledWith(
        JSON.stringify(`Reservation with id ${fakeReservationId} not found`)
      );
    });

    it("should return bad request if no id provided", async () => {
      authorizerMock.validateToken.mockResolvedValueOnce(true);
      requestMock.url = `localhost:8080/reservation/`;

      const actual = await sut.handleRequest();

      expect(actual).toBeUndefined();
      expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseMock.write).toHaveBeenCalledWith(
        JSON.stringify("Please provide an ID!")
      );
    });

    it("should return reservation for existing id", async () => {
      authorizerMock.validateToken.mockResolvedValueOnce(true);
      requestMock.url = `localhost:8080/reservation/${fakeReservationId}`;
      reservationsDataAccessMock.getReservation.mockResolvedValueOnce(
        someReservation
      );

      const actual = await sut.handleRequest();

      expect(actual).toBeUndefined();
      expect(responseMock.write).toHaveBeenCalledWith(
        JSON.stringify(someReservation)
      );
      expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.OK, {
        "Content-Type": "application/json",
      });
    });

    it("should return all reservations for /all request", async () => {
      authorizerMock.validateToken.mockResolvedValueOnce(true);
      requestMock.url = `localhost:8080/reservation/all`;
      reservationsDataAccessMock.getAllReservations.mockResolvedValueOnce([
        someReservation,
        someReservation2,
      ]);

      const actual = await sut.handleRequest();

      expect(actual).toBeUndefined();
      expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.OK, {
        "Content-Type": "application/json",
      });
      expect(responseMock.write).toHaveBeenCalledWith(
        JSON.stringify([someReservation, someReservation2])
      );
    });
  });

  describe("PUT request", () => {
    beforeEach(()=>{
        requestMock.headers.authorization = fakeTokenId;
        requestMock.method = HTTP_METHODS.PUT;
    });

    it("should validate empty request before update reservation", async () => {
      authorizerMock.validateToken.mockResolvedValueOnce(true);
      requestMock.url = `localhost:8080/reservation/${fakeReservationId}`;
      reservationsDataAccessMock.getReservation.mockResolvedValueOnce(
        someReservation
      );
      getRequestBodyMock.mockResolvedValueOnce({});

      const actual = await sut.handleRequest();

      expect(actual).toBeUndefined();
      expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseMock.write).toHaveBeenCalledWith(
        JSON.stringify("Please provide valid fields to update!")
      );
    });

    it("should return Not Found for invalid id", async () => {
      authorizerMock.validateToken.mockResolvedValueOnce(true);
      requestMock.url = `localhost:8080/reservation/${fakeReservationId}`;
      reservationsDataAccessMock.getReservation.mockResolvedValueOnce(
        undefined
      );

      const actual = await sut.handleRequest();

      expect(actual).toBeUndefined();
      expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND);
      expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(`Reservation with id ${fakeReservationId} not found`)
      );
    });    

    it("should ", async () => {
      authorizerMock.validateToken.mockResolvedValueOnce(true);
      requestMock.url = `localhost:8080/reservation/`;

      const actual = await sut.handleRequest();

      expect(actual).toBeUndefined();
      expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify('Please provide an ID!')
      );
    }); 

    it("should validate invalid request before update reservation", async () => {
      authorizerMock.validateToken.mockResolvedValueOnce(true);
      requestMock.url = `localhost:8080/reservation/${fakeReservationId}`;
      reservationsDataAccessMock.getReservation.mockResolvedValueOnce(
        someReservation
      );
      getRequestBodyMock.mockResolvedValueOnce(fakeReservation);

      const actual = await sut.handleRequest();

      expect(actual).toBeUndefined();
      expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseMock.write).toHaveBeenCalledWith(
        JSON.stringify("Please provide valid fields to update!")
      );
    });

    it("should update reservation with all valid fields provided", async () => {
      authorizerMock.validateToken.mockResolvedValueOnce(true);
      requestMock.url = `localhost:8080/reservation/${fakeReservationId}`;
      reservationsDataAccessMock.getReservation.mockResolvedValueOnce(
        someReservation
      );
      getRequestBodyMock.mockResolvedValueOnce(someReservation);

      const actual = await sut.handleRequest();

      expect(actual).toBeUndefined();
      expect(
        reservationsDataAccessMock.updateReservation
      ).toHaveBeenCalledTimes(5);
      expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.OK, {
        "Content-Type": "application/json",
      });

      expect(responseMock.write).toHaveBeenCalledWith(
        JSON.stringify(
          `Updated ${Object.keys(
            someReservation
          )} of reservation ${fakeReservationId}`
        )
      );
    });
  });

  describe('DELETE request', ()=>{
    beforeEach(()=>{
        requestMock.headers.authorization = fakeTokenId;
        authorizerMock.validateToken.mockResolvedValueOnce(true);
        requestMock.method = HTTP_METHODS.DELETE;
    });

    it('should delete reservation for id provided', async ()=>{
        requestMock.url = `localhost:8080/reservation/${fakeReservationId}`;

        const actual = await sut.handleRequest();

        expect(responseMock.statusCode).toBe(HTTP_CODES.OK);
        expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(`Deleted reservation with id ${fakeReservationId}`));
        expect(reservationsDataAccessMock.deleteReservation).toHaveBeenCalledWith(fakeReservationId)
    });

    it('should delete reservation for id provided', async ()=>{
        requestMock.url = `localhost:8080/reservation`;

        expect(await sut.handleRequest()).toBeUndefined();

        expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
        expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(`Please provide an ID!`));
        
    });
  });
});

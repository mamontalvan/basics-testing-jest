import { DataBase } from "../../../app/server_app/data/DataBase";
import { ReservationsDataAccess } from "../../../app/server_app/data/ReservationsDataAccess"

const insertMock = jest.fn();
const updateMock = jest.fn();
const deleteMock = jest.fn();
const getByMock = jest.fn();
const getAllElementsMock = jest.fn();

jest.mock("../../../app/server_app/data/DataBase",()=>{
    return {
        DataBase: jest.fn().mockImplementation(()=>{
            return {
                insert: insertMock,
                update: updateMock,
                delete: deleteMock,
                getBy: getByMock,
                getAllElements: getAllElementsMock
            }
        })
    }
});

type someReservationType = {
    id: string,
    room: string,
    user: string,
    startDate: string,
    endDate: string
}

describe('ReservationsDataAccess test suit', () =>{
    let sut: ReservationsDataAccess;

    const fakeId = '1213';

    const someReservation = {
        id: '',
        room: 'someRoom',
        user: 'someUser',
        startDate: '2026-01-01',
        endDate: '2026-01-05'    
    }

    beforeEach(()=>{
        sut = new ReservationsDataAccess();
        expect(DataBase<someReservationType>).toHaveBeenCalledTimes(1);
    });

    afterEach(()=>{
        jest.clearAllMocks();
    });

    it('should create reservation and return id', async()=>{
        insertMock.mockResolvedValueOnce(fakeId);
        const actual = await sut.createReservation(someReservation);
        expect(actual).toBe(fakeId);
    });

    it('should update and return undefined ', async() => {
        expect(await sut.updateReservation(fakeId, 'room', 'someRoom')).toBeUndefined();
    });

    it('should delete and return undefined ', async() => {
        expect(await sut.deleteReservation(fakeId)).toBeUndefined();
    });

    it('should return reservation', async() => {
        const actual = await sut.getReservation(fakeId);
    })
    
})
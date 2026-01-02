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
        room: 'someRoom1',
        user: 'someUser1',
        startDate: '2026-01-01',
        endDate: '2026-01-05'    
    };

    const someReservation2 = {
        id: '',
        room: 'someRoom2',
        user: 'someUser2',
        startDate: '2027-01-01',
        endDate: '2027-01-05'    
    };

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
        expect(updateMock).toHaveBeenCalledWith(fakeId,'room', 'someRoom');
    });

    it('should delete and return undefined ', async() => {
        const id = await sut.createReservation(someReservation);
        
        await sut.deleteReservation(id);
        const actual = await sut.getReservation(id);

        expect(actual).toBeUndefined(); 
        expect(deleteMock).toHaveBeenCalledWith(id);       
    });

    it('should return reservation', async() => {
        getByMock.mockResolvedValueOnce(someReservation);
        
        const actual = await sut.getReservation(fakeId);

        expect(actual).toStrictEqual(someReservation);
    })
    
    it('should return array of reservations', async()=>{
        getAllElementsMock.mockResolvedValueOnce([someReservation, someReservation2]);

        const actual = await sut.getAllReservations();

        expect(actual).toEqual([someReservation,someReservation2]);
        expect(getAllElementsMock).toHaveBeenCalledTimes(1);
    });
})
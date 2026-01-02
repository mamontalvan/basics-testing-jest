import { DataBase } from "../../../app/server_app/data/DataBase";
import { SessionTokenDataAccess } from "../../../app/server_app/data/SessionTokenDataAccess";
import { Account } from "../../../app/server_app/model/AuthModel";

const insertMock = jest.fn();
const updateMock = jest.fn();
const getByMock = jest.fn();

jest.mock("../../../app/server_app/data/DataBase",()=>{
    return {
        DataBase: jest.fn().mockImplementation(()=>{
            return {
                insert: insertMock,
                update: updateMock,
                getBy: getByMock,
            }
        })
    }
});

const someAccount: Account = {
    id: '',
    password: 'somePassword',
    userName: 'someUserName'
}

const someSessionToken = {
    id: '',
    userName: 'someUserName',
    valid: true,
    expirationDate: '2026-01-01',
}

describe('SessionTokenDataAccess suit test', ()=>{
    let sut: SessionTokenDataAccess;
    const fakeId = '1234'

    beforeEach(()=>{
        sut = new SessionTokenDataAccess();
        expect(DataBase).toHaveBeenCalledTimes(1);
        jest.spyOn(global.Date, 'now').mockReturnValue(0);
    });

    afterEach(()=>{
        jest.clearAllMocks();
    });

    it('should insert new token and return idToken', async ()=>{
        insertMock.mockResolvedValueOnce(fakeId);

        const actualTokenId = await sut.generateToken(someAccount);

        expect(actualTokenId).toBe(fakeId);
        expect(insertMock).toHaveBeenCalledWith({
            id: '',
            userName: someAccount.userName,
            valid: true,
            expirationDate: new Date(1000 * 60 * 60),
        });
    });

    it('should invalidate token', async ()=>{
        expect(await sut.invalidateToken(fakeId)).toBeUndefined();
        expect(updateMock).toHaveBeenCalledWith(fakeId,'valid',false);
    });
    
    it('should check valid', async ()=> {
        getByMock.mockResolvedValueOnce({ valid: true });

        const actualToken = await sut.isValidToken(fakeId);

        expect(actualToken).toBe(someSessionToken.valid);
    });

    it('should validate token is not valid', async ()=> {
        expect(await sut.isValidToken(fakeId)).toBe(false);
    });    
})
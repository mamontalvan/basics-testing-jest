import { Authorizer } from "../../../app/server_app/auth/Authorizer"
import { SessionTokenDataAccess } from "../../../app/server_app/data/SessionTokenDataAccess";
import { UserCredentialsDataAccess } from "../../../app/server_app/data/UserCredentialsDataAccess";

const isValidTokenMock = jest.fn();
const generateTokenMock = jest.fn();
const invalidateTokenMock = jest.fn();

const addUserMock = jest.fn();
const getUserByUserNameMock = jest.fn();

jest.mock("../../../app/server_app/data/SessionTokenDataAccess", ()=>{
    return {
        SessionTokenDataAccess: jest.fn().mockImplementation(()=>{
            return {
                isValidToken: isValidTokenMock,
                generateToken: generateTokenMock,
                invalidateToken: invalidateTokenMock,
            }
        })
    }
});

jest.mock("../../../app/server_app/data/UserCredentialsDataAccess", ()=>{
    return {
        UserCredentialsDataAccess: jest.fn().mockImplementation(()=>{
            return {
                addUser: addUserMock,
                getUserByUserName: getUserByUserNameMock,
            }
        })
    }
});

describe('Authorizer test suit', ()=>{
    let sut: Authorizer;
    const fakeToken = '123456';
    const fakeId = '123';

    const someUser = {
        id:fakeId,
        password: 'somePassword',
        userName: 'someUserName'
    };

    beforeEach(()=>{
        sut = new Authorizer();
        expect(SessionTokenDataAccess).toHaveBeenCalledTimes(1);
        expect(UserCredentialsDataAccess).toHaveBeenCalledTimes(1);
    });

    afterEach(()=>{
        jest.clearAllMocks();
    });

    it('should validate token', async ()=>{
        isValidTokenMock.mockResolvedValueOnce(true);
        const actual = await sut.validateToken(fakeToken);

        expect(isValidTokenMock).toHaveBeenCalledWith(fakeToken);
        expect(actual).toBe(true);
    });

    it('should return undefined ', async ()=> {
        expect(await sut.logout(fakeToken)).toBeUndefined();
        expect(invalidateTokenMock).toHaveBeenCalledWith(fakeToken);
    });

    it('should return id for new registered user', async ()=>{
        addUserMock.mockReturnValueOnce(fakeId);

        const actual = await sut.registerUser(someUser.userName, someUser.password);

        expect(actual).toBe(fakeId);
        expect(addUserMock).toHaveBeenCalledWith({
            id: '',
            password: someUser.password,
            userName: someUser.userName
        });
    });

    it('should login with username and password provided', async ()=>{
        getUserByUserNameMock.mockReturnValueOnce(someUser);
        generateTokenMock.mockReturnValueOnce(fakeToken);

        const actual = await sut.login(someUser.userName, someUser.password);
        expect(actual).toBe(fakeToken);
    });
})
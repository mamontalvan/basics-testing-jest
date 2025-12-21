import { DataBase } from "../../../app/server_app/data/DataBase";
import { UserCredentialsDataAccess } from "../../../app/server_app/data/UserCredentialsDataAccess";
import { Account } from "../../../app/server_app/model/AuthModel";

const insertMock = jest.fn();
const getByMock = jest.fn();

jest.mock("../../../app/server_app/data/DataBase", ()=>{
  return {
    DataBase: jest.fn().mockImplementation(()=>{
      return {
        insert: insertMock,
        getBy: getByMock,
      }
    })
  }
});

describe('UserCredentialsDataAccess test suite', ()=>{
  let sut: UserCredentialsDataAccess;

  const someAccount: Account = {
    id:'',
    password: 'somePassword',
    userName: 'someUser',
  };

  const fakeId = '1234'

  beforeEach(()=>{
    sut = new UserCredentialsDataAccess();
    expect(DataBase).toHaveBeenCalledTimes(1);
  });

  afterEach(()=>{
    jest.clearAllMocks();
  });

  it("should add user and return userId", async() => {
    insertMock.mockResolvedValueOnce(fakeId);
    const actual = await sut.addUser(someAccount);
    expect(actual).toBe(fakeId);
    expect(insertMock).toHaveBeenCalledWith(someAccount);
  });

  it("should return user", async()=> {
    getByMock.mockResolvedValueOnce(someAccount);
    const actual = await sut.getUserById(fakeId);
    expect(actual).toBe(someAccount);
    expect(getByMock).toHaveBeenCalledWith('id',fakeId);
  });

    it("should return user", async()=> {
    getByMock.mockResolvedValueOnce(someAccount);
    const actual = await sut.getUserByUserName(someAccount.userName);
    expect(actual).toBe(someAccount);
    expect(getByMock).toHaveBeenCalledWith('userName',someAccount.userName);
  });
})

import { calculateComplexity, OtherStringUtils, toUpperCaseWithCb } from "../../app/doubles/OtherUtils";

//Test doubles in JEST: Stubs 
describe.skip('OtherUtils test suite', ()=>{

    const sut = toUpperCaseWithCb;

    describe('OtherStringUtils tests with spies', ()=>{
        let sut: OtherStringUtils;

        beforeEach(()=>{
            sut = new OtherStringUtils();
        });

        test('use spy to tracks calls', () =>{
            const toUpperCaseSpy = jest.spyOn(sut, "toUpperCase");
            sut.toUpperCase('abc');
            expect(toUpperCaseSpy).toHaveBeenCalledWith('abc');
        });

        test('use spy to tracks calls to other module', () =>{
            const consoleLogSpy = jest.spyOn(console, "log");
            sut.logString('cdf');
            expect(consoleLogSpy).toHaveBeenCalledWith('cdf');
        });

        test('use spy to tracks calls to other module', () =>{
            const consoleLogCallExternalService = jest.spyOn(console, "log");
            (sut as any).callExternalService();
            expect(consoleLogCallExternalService).toHaveBeenCalledWith('Calling external service!!!');
        });

        test('use spy to replace the implementation of a method', () =>{
            jest.spyOn(sut as any, 'callExternalService').mockImplementation(()=>{
                console.log('Calling mocked implementation!!');
            });
            (sut as any).callExternalService();
        });
    });

    describe('Tracking callbacks with JEST Mocks', ()=>{

        const callBackMock = jest.fn();

        afterEach(()=>{
            jest.clearAllMocks();
        });

        it('calls callback for invalid argument - track calls', () =>{
            const invalidArgumentResponse = 'Invalid Argument!';
            const actual = sut('', callBackMock);
            expect(actual).toBeUndefined();
            expect(callBackMock).toHaveBeenCalledWith(invalidArgumentResponse);
            expect(callBackMock).toHaveBeenCalledTimes(1);
        });

        it('calls callback for valid argument - track calls', () =>{
            const argStringTest = 'abc';
            const stringExpected = 'ABC';
            const validArgumentResponse = `called function with ${argStringTest}`;
            const actual = sut(argStringTest, callBackMock);
            expect(actual).toBe(stringExpected);
            expect(callBackMock).toHaveBeenCalledWith(validArgumentResponse);
            expect(callBackMock).toHaveBeenCalledTimes(1)
        });
    });

    describe('Tracking callbacks', ()=>{
        let cbArgs = [];
        let timesCalled = 0;

        function callBackMock(arg: string) {
            cbArgs.push(arg);
            timesCalled++;
        }

        afterEach(() =>{
            //Clearing tracking fields
            cbArgs = [];
            timesCalled = 0;
        });

        it('calls callback for invalid argument - track calls', () =>{
            const invalidArgumentResponse = 'Invalid Argument!';
            const actual = sut('', callBackMock);
            expect(actual).toBeUndefined();
            expect(cbArgs).toContain(invalidArgumentResponse);
            expect(timesCalled).toBe(1)
        });

        it('calls callback for valid argument - track calls', () =>{
            const argStringTest = 'abc';
            const stringExpected = 'ABC';
            const validArgumentResponse = `called function with ${argStringTest}`;
            const actual = sut(argStringTest, callBackMock);
            expect(actual).toBe(stringExpected);
            expect(cbArgs).toContain(validArgumentResponse);
            expect(timesCalled).toBe(1)
        });

    });

    it('ToUpperCase - calls callback for invalid argument', () =>{
        const responseExpected = 'Invalid Argument!';
        const actual = sut('', ()=>{});
        expect(actual).toBeUndefined();
    });

    it('ToUpperCase - calls callback for valid argument', () =>{
        const stringArg = 'test';
        const stringArgExpected = 'TEST';
        const actual = sut(stringArg, ()=>{});
        expect(actual).toBe(stringArgExpected);
    });

    it('Calculates complexity', ()=>{
        const someInfo = {
            length: 5,
            extraInfo: {
                field1: 'someInformation',
                field2: 'someInformationMore'
            }
        }

        const actual = calculateComplexity(someInfo as any);
        expect(actual).toBe(10);
    });
});
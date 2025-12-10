import { calculateComplexity, toUpperCaseWithCb } from "../../app/doubles/OtherUtils";

//Test doubles in JEST: Stubs 
describe('OtherUtils test suite', ()=>{
    it('ToUpperCase - calls callback for invalid argument', () =>{
        const sut = toUpperCaseWithCb;
        const responseExpected = 'Invalid Argument!';
        const actual = sut('', ()=>{});
        expect(actual).toBeUndefined();
    });

    it('ToUpperCase - calls callback for valid argument', () =>{
        const sut = toUpperCaseWithCb;
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
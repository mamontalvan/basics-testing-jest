import { calculateComplexity } from "../../app/doubles/OtherUtils";

//Test doubles in JEST: Stubs 
describe('OtherUtils test suite', ()=>{
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
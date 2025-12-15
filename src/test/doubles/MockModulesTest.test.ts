//When you mock a module, this meaning that everything inside of module are empty
//That means every functions inside of module must return empty
jest.mock("../../app/doubles/OtherUtils",()=>({
    ...jest.requireActual("../../app/doubles/OtherUtils"),
    calculateComplexity: ()=>{ return 10; }
}));

jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));

import * as OtherUtils  from "../../app/doubles/OtherUtils";

describe.only('', ()=>{
    test('calculate complexity ', () => {
      const actual = OtherUtils.calculateComplexity({} as any);
      expect(actual).toBe(10);
    });

    test('keep other functions', ()=>{
        const actual = OtherUtils.toUpperCase('abc');
        expect(actual).toBe('ABC');
    });
   
    test('string with id', ()=>{
        const actual = OtherUtils.toLowerCaseWithId('ABC');
        expect(actual).toBe('abctest-uuid');
    });
});
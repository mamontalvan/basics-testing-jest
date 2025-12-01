import { getStringInfo, toUpperCase } from "../app/Utils"

describe('Utils test suit', () => {
    it('1. should return uppercase of valid string', () => {
        //Arrange
        const sut = toUpperCase;
        const expected = 'ABC';

        //Act
        const actual = sut('abc');
      
        //Assert
        expect(actual).toBe(expected);
    });

    describe('getStringInfo for argument: "String-Of-Test" should', () =>{
        //Arrange
        const sut = getStringInfo;
        const stringTest = 'String-Of-Test';
        
        test('should return rigth length', () => {
            //Arrange
            const expectCharactersLength = 14;
            //Act
            const actualCharactersLength = sut(stringTest).characters;

            ///Test length with 2 options:
            expect(actualCharactersLength.length).toBe(expectCharactersLength);
            expect(actualCharactersLength).toHaveLength(expectCharactersLength);
        });

        test('should return rigth lower string: "string-of-test"', () => {
            //Arrange
            const expectLowerString = 'string-of-test';
            //Act
            const actualLowerCase = sut(stringTest).lowerCase.toLowerCase();
            //Assert
            expect(actualLowerCase).toBe(expectLowerString);
        }); 
        
        test('should return ', () => {
            //Arrange
            const expectUpperString = 'STRING-OF-TEST';
            //Act
            const actualUpperCase = sut(stringTest).upperCase.toUpperCase();
            //Assert
            expect(actualUpperCase).toBe(expectUpperString);

        });

        test('should check if array of string is right', ()=>{
            //Arrange
            const expectStringArray = ['S','t','r','i','n','g','-','O','f','-','T','e','s','t'];
            const expectStringArrayUnOrder = ['g','-','O','f','e','s','t','S','t','r','-','T','i','n',];
            //Act
            const actualStringArray = sut(stringTest).characters;
            //Assert
            expect(actualStringArray).toEqual(expectStringArray);
            expect(actualStringArray).toContain<string>('S');
            expect(actualStringArray).toEqual( expect.arrayContaining(expectStringArrayUnOrder));
        });

        test('should check if object is right', ()=>{
            //Act
            const actualExtraInfo = sut(stringTest).extraInfo;
            //Assert: Test Objects (not know object's structure ) or Undefined
            expect(actualExtraInfo).not.toBe(undefined);
            expect(actualExtraInfo).not.toBeUndefined();
            expect(actualExtraInfo).toBeDefined();
            expect(actualExtraInfo).toBeTruthy();
        });
    });


})
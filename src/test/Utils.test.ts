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

    it.only('2. should return info for valid string', () => {
        //Arrange
        const sut = getStringInfo;
        const stringTest = 'String-Of-Test';
        const expectLowerString = 'string-of-test';
        const expectUpperString = 'STRING-OF-TEST';
        const expectCharactersLength = 14;
        const expectStringArray = ['S','t','r','i','n','g','-','O','f','-','T','e','s','t'];
        const expectStringArrayUnOrder = ['g','-','O','f','e','s','t','S','t','r','-','T','i','n',];

        //Act
        const actualLowerCase = sut(stringTest).lowerCase.toLowerCase();
        const actualUpperCase = sut(stringTest).upperCase.toUpperCase();
        const actualExtraInfo = sut(stringTest).extraInfo;
        const actualCharactersLength = sut(stringTest).characters;
        const actualCharacters = sut(stringTest).characters;

        //Assert
        expect(actualLowerCase).toBe(expectLowerString);
        expect(actualUpperCase).toBe(expectUpperString);
        expect(actualExtraInfo).toEqual({});
        ///Test length with 2 options:
        expect(actualCharactersLength.length).toBe(expectCharactersLength);
        expect(actualCharactersLength).toHaveLength(expectCharactersLength);
        //Test arrays with 3 options:
        expect(actualCharacters).toEqual(expectStringArray);
        expect(actualCharacters).toContain<string>('S');
        expect(actualCharacters).toEqual(
            expect.arrayContaining(expectStringArrayUnOrder)
        );
        //Test Objects (not know object's structure ) or Undefined
        console.log('actualExtraInfo', actualExtraInfo);
        expect(actualExtraInfo).not.toBe(undefined);
        expect(actualExtraInfo).not.toBeUndefined();
        expect(actualExtraInfo).toBeDefined();
        expect(actualExtraInfo).toBeTruthy();
    });
    
})
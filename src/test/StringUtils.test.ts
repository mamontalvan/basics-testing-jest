import { StringUtils } from "../app/StringUtils";

describe('StringUtils test suite', ()=>{
    describe('Error tests',()=>{
        let sut: StringUtils;

        beforeEach(()=>{
            sut = new StringUtils();
        });

        afterEach(()=>{
            //clearing mocks
        });

        //it.todo('Test long Strings');

        it('Should throw error on invalid argument - function',()=>{
            //Arrange
            //Act - Wrapping the code that shows an error 
            function expectError() {
                const actual = sut.toUpperCase('');
            }            
            //Assert
            expect(expectError).toThrow();
            expect(expectError).toThrowErrorMatchingInlineSnapshot(`"Invalid argument!"`);
        });

        it('Should throw error on invalid argument - arrow function',()=>{
            //Arrange
            //Act             
            //Assert - Wrapping the code that shows an error
            expect(() => { sut.toUpperCase('') }).toThrowErrorMatchingInlineSnapshot(`"Invalid argument!"`);
        });

        it('Should throw error on invalid argument - try catch block',(done)=>{
            //Arrange
            //Act             
            //Assert - Wrapping the code that shows an error
            try {
                sut.toUpperCase('');
                done('should throw error for invalid argument');
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                expect(error).toHaveProperty('message','Invalid argument!');
                done();
            }
        });
    });
});
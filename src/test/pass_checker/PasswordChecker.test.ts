import { PasswordChecker, PasswordError } from "../../app/pass_checker/PasswordChecker";

/*
A password is invalid if:
- length is less than 8 chars
- has no upper case letter
- has no lower case letter
*/
describe('PasswordChecker test suite',()=>{
    let sut: PasswordChecker;

    beforeEach(()=>{
        sut = new PasswordChecker();
    });

    it('Password with less than 8 chars is invalid', ()=>{
        const actual = sut.checkPassword('1234567');
        expect(actual.valid).toBe(false);
        expect(actual.reasons).toContain(PasswordError.SHORT);
    });

    it('Password with more than 8 chars is valid', ()=>{
        const actual = sut.checkPassword('12345678Ae');
        expect(actual.valid).toBe(true);
        expect(actual.reasons).not.toContain(PasswordError.SHORT);
    });

    it('Password with no upper case letter is invalid', ()=>{
        const actual = sut.checkPassword('123paswo');
        expect(actual.valid).toBe(false);
        expect(actual.reasons).toContain(PasswordError.NO_UPPER_CASE);
    });
    
    it('Password with upper case letter is valid', ()=>{
        const actual = sut.checkPassword('123paswoM');
        expect(actual.valid).toBe(true);
        expect(actual.reasons).not.toContain(PasswordError.NO_UPPER_CASE);
    });
    
    it('Password with no lower case letter is invalid', ()=>{
        const actual = sut.checkPassword('1234ABCD');
        expect(actual.valid).toBe(false);
        expect(actual.reasons).toContain(PasswordError.NO_LOWER_CASE);
    });
    
    it('Password with lower case letter is valid', ()=>{
        const actual = sut.checkPassword('1234ABCDa');
        expect(actual.valid).toBe(true);
        expect(actual.reasons).not.toContain(PasswordError.NO_LOWER_CASE);
    });
    
    it('Complex Password is valid', ()=>{
        const actual = sut.checkPassword('1234abcD');
        expect(actual.valid).toBe(true);
        expect(actual.reasons).toHaveLength(0);
    }); 
});
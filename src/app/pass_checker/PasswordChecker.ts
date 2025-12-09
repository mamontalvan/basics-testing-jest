//Requeriment 2: Reasons to make a password invalid
export enum PasswordError {
    SHORT = 'Password is too short!',
    NO_UPPER_CASE = 'Upper case letter required!',
    NO_LOWER_CASE = 'Lower case letter required!',
    NO_NUMBER = 'At least one number required!',
}
export interface CheckResult {
    valid: boolean,
    reasons: PasswordError[]
}

export class PasswordChecker {    
    public checkPassword(password: string): CheckResult {
        const reasons: PasswordError[] = [];

        this.checkForLength(password, reasons);

        this.checkForLowerCase(password, reasons);

        this.checkForUpperCase(password, reasons);

        return {
            valid: reasons.length > 0 ? false : true,
            reasons
        };
    }

    public checkAdminPassword(password: string): CheckResult {
        const basicCheck = this.checkPassword(password);

        this.checkForNumber(password, basicCheck.reasons);

        return {
            valid: basicCheck.reasons.length > 0 ? false : true,
            reasons: basicCheck.reasons
        };
    }

    private checkForNumber(password: string, reasons: PasswordError[]){
        let regex = /\d/;
        if(password && !regex.test(password)){
            reasons.push(PasswordError.NO_NUMBER);
        }
    }

    private checkForLength(password: string, reasons: PasswordError[]){
        if(password && password.length < 8){
            reasons.push(PasswordError.SHORT);
        }
    }

    private checkForLowerCase(password: string, reasons: PasswordError[]){
        if (password === password.toLowerCase()) {
            reasons.push(PasswordError.NO_UPPER_CASE);
        }
    }

    private checkForUpperCase(password: string, reasons: PasswordError[]){
        if (password === password.toUpperCase()) {
            reasons.push(PasswordError.NO_LOWER_CASE);
        }
    }
}
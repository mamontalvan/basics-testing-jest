export enum PasswordError {
    SHORT = 'Password is too short!',
    NO_UPPER_CASE = 'Upper case letter required!',
    NO_LOWER_CASE = 'Lower case letter required!'
}
export interface CheckResult {
    valid: boolean,
    reasons: PasswordError[]
}

export class PasswordChecker {    
    public checkPassword(password: string): CheckResult {
        const reasons: PasswordError[] = [];

        if(password && password.length < 8){
            reasons.push(PasswordError.SHORT);
        }

        if (password === password.toLowerCase()) {
            reasons.push(PasswordError.NO_UPPER_CASE);
        }

        if (password === password.toUpperCase()) {
            reasons.push(PasswordError.NO_LOWER_CASE);
        }

        return {
            valid: reasons.length > 0 ? false : true,
            reasons
        };
    }
}
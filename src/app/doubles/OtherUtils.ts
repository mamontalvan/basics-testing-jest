type StringInfo = {
    lowerCase: string,
    upperCase: string,
    characters: string[],
    length: number,
    extraInfo: Object | undefined,
}

type LoggerServiceCallBack = (arg:string) => void;
export function calculateComplexity(stringInfo:StringInfo) {
    return Object.keys(stringInfo.extraInfo).length * stringInfo.length;
}

export function toUpperCaseWithCb(arg: string, callBack: LoggerServiceCallBack) {
    if(!arg){
        callBack('Invalid Argument!');
        return;
    }

    callBack(`called function with ${arg}`);
    return arg.toUpperCase();
}
export function toUpperCase(arg: string) {
    return arg.toUpperCase(); 
}

export type StringInfo = {
    lowerCase: string,
    upperCase: string,
    characters: string[],
    length: number,
    extraInfo: Object | undefined,
}

export function getStringInfo(arg: string): StringInfo {
    return {
        lowerCase: arg.toLowerCase()+'hello',
        upperCase: arg.toUpperCase(),
        characters: Array.from(arg),
        length: arg.length,
        extraInfo: {}
    }
}
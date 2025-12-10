export type StringInfo = {
    lowerCase: string,
    upperCase: string,
    characters: string[],
    length: number,
    extraInfo: Object | undefined,
}

export function calculateComplexity(stringInfo:StringInfo) {
    return Object.keys(stringInfo.extraInfo).length * stringInfo.length;
}
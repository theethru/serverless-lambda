import * as uuid from 'node-uuid';

export const makeUuidV4 = (): string => {
    return uuid.v4();
}

export const getRandomNumber = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export const makeRandomString = (length) => {
    var result = '';
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const jsonParse = (str) => {
    try {
        return JSON.parse(str);
    } catch (err) {
        return null;
    }
}

export const jsonStringify = (jsonObj) => {
    try {
        return JSON.stringify(jsonObj)
    } catch (err) {
        return null;
    }
}
import { BadRequestException } from './../exceptions/common.exception';

export const checkHasAccessToken = (headers: object) => {
    // express 에서는 header 의 key 시작값이 모두 소문자로 캐스팅됨
    return headers['authorization'];
}
export const getAccessToken = (headers: object) => {
    if (!headers['authorization']) {
        throw new BadRequestException('NEED_AUTHORIZATION_HEADER');
    } else if (headers['authorization'].toLowerCase().indexOf('bearer') !== 0) {
        throw new BadRequestException('WRONG_AUTHORIZATION_HEADER');
    } else {
        const accessTokens = headers['authorization'].split(" ");
        if (accessTokens.length < 2) {
            throw new BadRequestException('NEED_ACCESS_TOKEN');
        }

        const accessToken = accessTokens[1];
        if (accessToken.trim() === '') {
            throw new BadRequestException('NEED_ACCESS_TOKEN');
        }
        return accessToken;
    }
}

export const getDeviceUuid = (headers: object) => {
    if (!headers['device-uuid']) {
        return null;
    } else {
        return headers['device-uuid'];
    }
}

export const getDeviceCode = (headers: object) => {
    if (!headers['device-code']) {
        return null;
    } else {
        return headers['device-code'];
    }
}

export const getAcceptLanguage = (headers: object) => {
    if (!headers['accept-language']) {
        return 'ko';
    } else {
        return headers['accept-language']
    }
}
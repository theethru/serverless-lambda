import * as httpContext from 'express-http-context';
import * as messageHelper from '../helpers/message.helper';

export interface IStatusCodeException {
    message: string;
    statusCode: number;
    data: any;
    errorCode: string;
}

export class StatusCodeException extends Error implements IStatusCodeException {
    statusCode: number;
    data: any;
    errorCode: string;
    constructor(messageCode: string, statusCode: number, params: any = {}) {
        console.log('common.exception:StatusCodeException', messageCode, params);
        const userData = httpContext.get('userData');
        const languageCode = userData ? userData.getLanguageCode() : 'en';
        const message = messageHelper.getErrorMessage(messageCode, languageCode);

        super(message);

        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.data = params['data'] ? params['data'] : null;
        this.errorCode = messageCode;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class PageNotFoundException extends StatusCodeException {
    constructor(messageCode = 'PAGE_NOT_FOUND', params = {}) {
        console.log('common.exception:PageNotFoundException', messageCode, params);
        super(messageCode, 404);

        this.name = this.constructor.name;
        this.statusCode = 404;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class BadRequestException extends StatusCodeException {
    test: string;

    constructor(messageCode = 'BAD_REQUEST', params = {}) {
        console.log('common.exception:BadRequestException', messageCode, params);
        super(messageCode, 400);

        this.name = this.constructor.name;
        this.statusCode = 400;
        this.data = params['data'] ? params['data'] : null;
        this.errorCode = messageCode;
        this.test = "test";

        Error.captureStackTrace(this, this.constructor);
    }
}

// statusCode 204(no contents)는 응답에 아무런 메시지를 포함할 수 없음.
export class NoContentsException extends StatusCodeException {
    constructor(messageCode = "NO_CONTENTS", data = null) {
        super(messageCode, 204);

        this.name = this.constructor.name;
        this.statusCode = 204;
        this.data = data;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class NoDataException extends StatusCodeException {
    constructor(messageCode = "NO_DATA", data = null) {
        super(messageCode, 200);

        this.name = this.constructor.name;
        this.statusCode = 200;
        this.data = data;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class ExpiredAuthException extends StatusCodeException {
    constructor(messageCode = "EXPIRED_AUTH", data = null) {
        super(messageCode, 401);

        this.name = this.constructor.name;
        this.statusCode = 401;
        this.data = data;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotAuthorizedException extends StatusCodeException {
    constructor(message = "NOT_AUTHORIZATION", data = null) {
        super(message, 403);

        this.name = this.constructor.name;
        this.statusCode = 403;
        this.data = data;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class UnknownException extends StatusCodeException {
    constructor(message = 'UNKNOWN_ERROR', data = null) {
        super(message, 500);

        this.name = this.constructor.name;
        this.statusCode = 500;
        this.data = data;

        Error.captureStackTrace(this, this.constructor);
    }
}
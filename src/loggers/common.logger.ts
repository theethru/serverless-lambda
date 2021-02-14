import { Request, Response } from '../interfaces/express.interfaces';

import * as httpContext from 'express-http-context';

let SERVICE_CODE: string = "";
const FOR: string = "API-V1";
const BEGIN_TIMESTAMP: number = new Date().getTime();

export const init = (req: any) => {
    SERVICE_CODE = req.path.split('/')[1];
}
export const log = (type, userId, statusCode, params = {}) => {
    console.log(FOR, SERVICE_CODE, `${type}`, userId, statusCode, JSON.stringify(params));
}
export const request = (req: Request) => {
    const userData = httpContext.get('userData');
    console.log('userData', userData);
    const userId = userData.getId();
    log('REQUEST', userId, -1, null);
}
export const response = (res: Response, resMessage = null) => {
    console.log('common.logger:response');
    const userData = httpContext.get('userData');
    const userId = userData.getId();
    const statusCode = res.statusCode;

    let resObj: any = {};
    if (resObj) {
        try {
            resObj = JSON.parse(resMessage);
        } catch (err) {
            resObj = { message: resMessage };
        }
    }

    let { message, data } = resObj;
    if (!message) {
        message = '';
    }
    if (!data) {
        data = {}
    }

    let endTimestamp = new Date().getTime();
    const params = {
        message,
        data: JSON.stringify(data),
        duration: (endTimestamp - BEGIN_TIMESTAMP)
    }
    log('RESPONSE', userId, statusCode, params);
}
export const query = (query: string, values = null) => {
    console.log('common.logger:query');
    const userData = httpContext.get('userData');
    const userId = userData.getId();
    const params = {
        query, values
    };
    log("QUERY", userId, -1, params);
}

// Lambda Pattern
// [timestamp=*Z, request_id="*-*", event, for="API*", serviceCode, type, userId, statusCode, etc]
// API-V1, serviceCode(resource), type, userId, statusCode, etc
// console.log("API-V1", "auth", "REQUEST", null, null, JSON.stringify(event.headers), event.body);
// console.log("API-V1", "auth", "RESPONSE", null, "200", "success", "1000");
// console.log("API-V1", "auth", "DEBUG", "1023", null, "querystringasdfasdf", "values");
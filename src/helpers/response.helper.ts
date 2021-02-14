import * as httpContext from 'express-http-context';
import UserData from '../data/user.data';

import { getSuccessMessage } from './message.helper';

export interface IResponseObject {
    message: string,
    errorCode: string,
    data: object
}

export const makeResponse = (dataObj: any, messageCode: string = 'SUCCESS') => {
    const userData: UserData = httpContext.get('userData');
    const languageCode = userData.getLanguageCode();

    const message = getSuccessMessage(messageCode, languageCode);
    return {
        message,
        data: dataObj
    }
}
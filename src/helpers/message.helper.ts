const successMessage = require('../messages/success.message.json');
const errorMessage = require('../messages/error.message.json');

export const getErrorMessage = (messageCode: string, languageCode: string = 'en') => {
    console.log('message.handler:getErrorMessage', messageCode, languageCode);
    if (!errorMessage[messageCode]) {
        return messageCode;
    } else if (!errorMessage[messageCode][languageCode]) {
        return errorMessage[messageCode]['en'];
    } else {
        return errorMessage[messageCode][languageCode];
    }
}

export const getSuccessMessage = (messageCode: string = 'SUCCESS', languageCode: string = 'en') => {
    console.log('message.handler:getSuccessMessage', messageCode, languageCode);
    if (!successMessage[messageCode]) {
        return messageCode;
    } else if (!successMessage[messageCode][languageCode]) {
        return successMessage[messageCode]['en'];
    } else {
        return successMessage[messageCode][languageCode];
    }
}
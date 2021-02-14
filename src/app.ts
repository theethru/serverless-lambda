import { APIGatewayProxyHandler } from 'aws-lambda';

import * as express from 'express';
import { Application, } from 'express';
import { Response, Request, NextFunction } from './interfaces/express.interfaces';

import * as serverless from "serverless-http";

import * as httpContext from 'express-http-context';
import * as bodyParser from 'body-parser';

import UserData from './data/user.data';
import * as headersHelper from './helpers/headers.helper';
import * as commonLogger from './loggers/common.logger';

import { IStatusCodeException } from "./exceptions/common.exception";
import { IResponseObject } from './helpers/response.helper';
import * as cors from 'cors';

// init Express
const app: Application = express();
app.use(bodyParser.json({ strict: false }));
app.use(httpContext.middleware); // bodyParser 보다 앞서 선언하면 에러발생.
app.use(cors());

// initialize DB
import DbManager from './db/manager.db';
app.use(async (req: Request, res: Response, next: NextFunction) => {
    console.log("----------START API----------");
    try {
        console.log(": DB INITIALIZE");

        DbManager.getInstance();
        await DbManager.getInstance().init();

        next();
    } catch (err) {
        console.error(err);
        exceptionRoutine(err, req, res, next);
    }
})

// initialize Header Info
app.use(async (req: Request, res: Response, next: NextFunction) => {
    console.log(': HEADER INITIALIZE');

    let userData = new UserData();

    const languageCode = headersHelper.getAcceptLanguage(req.headers);
    const uuid = headersHelper.getDeviceUuid(req.headers);
    const deviceCode = headersHelper.getDeviceUuid(req.headers);

    userData.setLanguageCode(languageCode);
    userData.setDeviceUuid(uuid);
    userData.setDeviceCode(deviceCode);

    httpContext.set('userData', userData);

    next();
});

// Check accessToken
import * as authService from './services/auth.service';
import * as UserService from './services/user.service';

const accessTokenExceptionUris = [
    '/app/code',
    '/auth/login',
    '/auth/signup',
    '/auth/refresh-access-token',
]

app.use(async (req: Request, res: Response, next: NextFunction) => {
    console.log(": CHECK ACCESS TOKEN");
    try {
        const userData: UserData = httpContext.get('userData');

        if (headersHelper.checkHasAccessToken(req.headers) || !accessTokenExceptionUris.includes(req.url)) {
            const accessToken = headersHelper.getAccessToken(req.headers);
            const { userInfo } = await authService.getUserInfoByAccessToken(accessToken);

            userData.setUser(userInfo);

            httpContext.set('userData', userData);

            await UserService.updateLastActivityAt(userData.getId());
        }

        next();
    } catch (err) {
        exceptionRoutine(err, req, res, next);
    }
})

// Logger Init
app.use(async (req: Request, res: Response, next: NextFunction) => {
    console.log(": LOGGER INITIALIZE");
    commonLogger.init(req);
    commonLogger.request(req);
    next();
})

// Exception Routine Init
const exceptionRoutine = async (err: IStatusCodeException, req: Request, res: Response, next: NextFunction) => {
    console.log(": Exception Routine");
    await DbManager.getInstance().rollback();
    await DbManager.getInstance().endConnection();

    if (!err.statusCode) {
        err.statusCode = 500;
    }

    console.log('err.statusCode', err.statusCode);
    res.status(err.statusCode);
    let resObj: IResponseObject = {
        message: err.message,
        errorCode: err.errorCode,
        data: err.data
    }
    res.json(resObj);
    console.log("==========ERROR API==========")
}

// response 오버라이딩
// function 형태를 유지해야함
app.use(async function (req: Request, res: Response, next: NextFunction) {
    var send = res.send;

    res.send = async function (data) {
        console.log('data', data, arguments);
        await DbManager.getInstance().endConnection();
        commonLogger.response(res, data);
        send.apply(res, arguments);
        console.log('====================END API====================');
    }
    next();
});

// Init Router
import * as Router from './routers';
Router.init(app);

// Response
import { makeResponse } from './helpers/response.helper';
app.use(async (req: Request, res: Response) => {
    console.log(": SEND RESPONSE");
    if (!req['result']) {
        let resObj = makeResponse(null, 'Page Not Found');
        res.status(404).json(resObj);
    } else {
        let resObj = makeResponse(req['result']);
        res.json(resObj);
    }
});

// Exception login middleware
app.use(exceptionRoutine);

export const handler: APIGatewayProxyHandler = serverless(app);
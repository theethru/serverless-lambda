import { NotAuthorizedException } from '../exceptions/common.exception';
import { Application, Router } from 'express';
import { Request, Response, NextFunction } from '../interfaces/express.interfaces';
import * as asyncify from 'express-asyncify';

import * as httpContext from 'express-http-context';
import UserData from '../data/user.data';

const basePath: string = '/auth';
const router: Router = asyncify(Router());

import * as authService from '../services/auth.service';
import * as headersHelper from '../helpers/headers.helper';
import * as JwtService from '../services/jwt.service';

interface ISignupBody {
    email: string,
    password: string,
    confirmedPassword: string,
    name: string,
    genderTypeCode: string,
}
router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    console.log('auth.router:signup');

    const {
        email, password, confirmedPassword,
        name, genderTypeCode } = req.body as ISignupBody;

    req['result'] = await authService.signup(
        email, password, confirmedPassword,
        name, genderTypeCode);
    next();
});

interface ILoginBody {
    email: string,
    password: string
}
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    console.log('auth.router:login');

    const { email, password } = req.body as ILoginBody;

    req['result'] = await authService.login(email, password);
    next();
});

router.post('/check-access-token', async (req: Request, res: Response, next: NextFunction) => {
    console.log('auth.router:checkAccessToken');

    const accessToken = headersHelper.getAccessToken(req.headers);
    req['result'] = { accessToken }
    next();
});

router.post('/refresh-access-token', async (req: Request, res: Response, next: NextFunction) => {
    console.log('auth.router:refreshAccessToken');

    const accessToken = headersHelper.getAccessToken(req.headers);
    req['result'] = await authService.refreshAccessToken(accessToken);
    next();
});

interface ISecessionBody {
    password: string
}
router.post('/secession', async (req: Request, res: Response, next: NextFunction) => {
    console.log('auth.router:secession');

    const userData: UserData = httpContext.get('userData');
    const userId = userData.getId();
    if (!userId) {
        throw new NotAuthorizedException();
    }

    const { password } = req.body as ISecessionBody;
    req['result'] = await authService.secession(userId, password);
    next();
});


export const init = (app: Application) => {
    console.log('auth.router:init');
    app.use(`${basePath}`, router);
}
import { NotAuthorizedException } from './../exceptions/common.exception';

import { Application, Router } from 'express';
import { Request, Response, NextFunction } from '../interfaces/express.interfaces';
import * as asyncify from 'express-asyncify';

import * as httpContext from 'express-http-context';
import UserData from '../data/user.data';

import * as myService from '../services/my.service';

const basePath: string = '/my';
const router: Router = asyncify(Router());

router.get('/info', async (req: Request, res: Response, next: NextFunction) => {
    console.log('auth.router:getMyInfo');

    const userData: UserData = httpContext.get('userData');
    const userId = userData.getId();
    if (!userId) {
        throw new NotAuthorizedException();
    }

    req['result'] = await myService.getInfo(userId);
    next();
});

interface IUpdateInfoBody {
    name: string,
    imageId: number,
    genderTypeCode: string
}
router.put('/info', async (req: Request, res: Response, next: NextFunction) => {
    console.log('user.router:updateInfo')

    const userData: UserData = httpContext.get('userData');
    const userId = userData.getId();

    const { name, imageId, genderTypeCode }: IUpdateInfoBody = req.body as any
    req['result'] = await myService.updateInfo(userId, name, imageId, genderTypeCode);
    next();
});

interface IUpdatePasswordBody {
    password: string,
    newPassword: string,
    confirmedNewPassword: string
}
router.patch('/password', async (req: Request, res: Response, next: NextFunction) => {
    console.log('user.router:updatePassword')

    const userData: UserData = httpContext.get('userData');
    const userId = userData.getId();

    const { password, newPassword, confirmedNewPassword }: IUpdatePasswordBody = req.body as any
    req['result'] = await myService.updatePassword(userId, password, newPassword, confirmedNewPassword);
    next();
});

export const init = (app: Application) => {
    console.log('my.router:init');
    app.use(`${basePath}`, router);
}
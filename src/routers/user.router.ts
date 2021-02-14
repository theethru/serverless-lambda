import { Router, Request, Response, NextFunction } from 'express';
import * as asyncify from 'express-asyncify';

import * as httpContext from 'express-http-context';
import UserData from '../data/user.data';

const basePath: string = '/v1/user';
const router: Router = asyncify(Router());

import * as userService from '../services/user.service';

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    console.log('user.router:getUserInfo');

    const id = req.params['id'];

    req['result'] = await userService.getInfo(id);
    next();
})

export const init = (app) => {
    console.log('AppRouter:init');
    app.use(`${basePath}`, router);
}
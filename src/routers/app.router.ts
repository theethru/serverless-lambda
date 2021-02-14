import { Application, Router } from 'express';
import { Request, Response, NextFunction } from '../interfaces/express.interfaces';
import * as asyncify from 'express-asyncify';

const basePath: string = '/app';
const router: Router = asyncify(Router());

import * as AppService from '../services/app.service';

router.get('/code', async (req: Request, res: Response, next: NextFunction) => {
    console.log('app.router:getCommonCodeList');

    req['result'] = await AppService.getCodeList();
    next();
})

export const init = (app: Application) => {
    console.log('CommonCodeRouter:init');
    app.use(`${basePath}`, router);
}
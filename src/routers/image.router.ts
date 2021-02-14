import { Application, Router } from 'express';
import { Request, Response, NextFunction } from '../interfaces/express.interfaces';
import * as asyncify from 'express-asyncify';

import * as httpContext from 'express-http-context';
import UserData from '../data/user.data';

const basePath: string = '/image';
const router: Router = asyncify(Router());

import * as imageService from '../services/image.service';

interface IImageCreateInfoBody {
    fileName: string,
    fileSize: number,
    width: number,
    height: number,
}
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    console.log('image.router:createInfo');

    const userData: UserData = httpContext.get('userData');
    const userId = userData.getId();

    const { fileName, fileSize, width, height }: IImageCreateInfoBody = req.body;

    req['result'] = await imageService.createInfo(fileName, fileSize, width, height, userId);
    next();
});
export const init = (app: Application) => {
    console.log('ImageRouter:init');
    app.use(`${basePath}`, router);
}
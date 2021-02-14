import { Application } from 'express';
import * as appRouter from './app.router';
import * as authRouter from './auth.router';
import * as myRouter from './my.router';
import * as imageRouter from './image.router';
// import * as authRouter from './auth';
// import * as dataRouter from './auth';
// import * as myRouter from './image.router';

export const init = (app: Application) => {
    console.log('router:init');
    appRouter.init(app);
    authRouter.init(app);
    myRouter.init(app);
    imageRouter.init(app);
    // authRouter.init(app);
    // dataRouter.init(app);
    // MyRouter.init(app);
}
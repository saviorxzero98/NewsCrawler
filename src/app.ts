import * as express from 'express';
import { TTVNewsRouter } from './news/ttv/router';
import { CTSNewsRouter } from './news/tbs/router';

const app = express();

export const startWebServer = (port: number = 1200) => {

    TTVNewsRouter.router(app);
    CTSNewsRouter.router(app);

    app.listen(port, () => {
        console.info(`My RSS Server listening on port ${port}`)
    });
}

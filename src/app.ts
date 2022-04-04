import * as express from 'express';
import * as rssRouters from './apiRouters';
import NodeCache = require("node-cache");

import { ServiceContext } from './service';


const app = express();
const cache = new NodeCache();


export const startWebServer = (port: number = 1200) => {
    const services = new ServiceContext().registExpress(app)
                                         .registCache(cache);
    rssRouters.addRouters(services);

    app.listen(port, () => {
        console.info(`My RSS Server listening on port ${port}`)
    });
}


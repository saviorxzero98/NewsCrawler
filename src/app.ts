import * as express from 'express';
import * as rssRouters from './apiRouters';
import NodeCache = require("node-cache");
import { CacheService } from './cache';

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

export class ServiceContext {
    public app: express.Express;

    public cache: CacheService;

    public registExpress(app: express.Express) {
        this.app = app;
        return this;
    }

    public registCache(cache: NodeCache) {
        this.cache = new CacheService(cache);
        return this;
    }
}
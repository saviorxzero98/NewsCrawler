import * as express from 'express';
import { CacheService } from './cache';
import { AppConfig } from './config';
import NodeCache = require("node-cache");

export class ServiceContext {
    public app: express.Express;

    public cache: CacheService;

    public config: AppConfig;

    constructor() {
        this.config = new AppConfig();
    }

    public registExpress(app: express.Express) {
        this.app = app;
        return this;
    }

    public registCache(cache: NodeCache) {
        this.cache = new CacheService(cache);
        return this;
    }

    public registConfig(config: AppConfig) {
        this.config = config ?? new AppConfig();
        return this;
    }
}
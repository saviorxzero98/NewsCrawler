import NodeCache = require("node-cache");

export class CacheService {

    private cache: NodeCache;

    constructor(cache: NodeCache) {
        this.cache = cache;
    }

    public async tryGet(key: string, callback: () => any): Promise<any> {
        let value = this.cache.get(key);
        if (value) {
            return value;
        }
        else {
            value = await callback();
            this.cache.set(key, value);
            return value;
        }
    }

    public get(key: string) {
        this.cache.get(key);
    }

    public set(key: string, value: any) {
        this.cache.set(key, value);
    }

    public remove(key: string) {
        this.cache.del(key);
    }
}
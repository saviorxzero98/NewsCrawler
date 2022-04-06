import NodeCache = require("node-cache");

export class CacheService {

    private cache: NodeCache;

    constructor(cache: NodeCache) {
        this.cache = cache;
    }

    public async tryGet<T>(key: string, callback: () => Promise<T>): Promise<T> {
        let value = this.cache.get<T>(key);
        if (value) {
            return value;
        }
        else {
            if (callback) {
                value = await callback()
                this.cache.set(key, value);
            }
            return value;
        }
    }

    public get<T>(key: string): T {
        return this.cache.get<T>(key);
    }

    public set<T>(key: string, value: T) {
        this.cache.set(key, value);
    }

    public remove(key: string) {
        this.cache.del(key);
    }
}
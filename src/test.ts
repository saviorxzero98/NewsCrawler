import NodeCache = require("node-cache");
import { ServiceContext } from "./services/service";

import { LTNNewsCrawler } from "./news/ltn/ltn";

const cache = new NodeCache();

export const testCrawlNews = async () => {
    let services = new ServiceContext().registCache(cache);

    let crawler = new LTNNewsCrawler(services);
    let news = await crawler.getNews();
    console.log(news);
}
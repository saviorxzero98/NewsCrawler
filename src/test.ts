import NodeCache = require("node-cache");

import { ServiceContext } from "./services/service";


const cache = new NodeCache();

export const testCrawlNews = async () => {
    let services = new ServiceContext().registCache(cache);

    //let crawler = new ChinaTimesNewsCrawler(services);
    //let news = await crawler.getNews();
    //console.log(news);
}
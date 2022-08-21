import { ServiceContext } from "../../../services/service";
import { FeedBuilder } from "../../../feeds/feedBuilder";

import { YamDQNewsCrawler } from "./dp";
import { TnnTodayNewsCrawler } from "./tnntoday";

const path = {
    dq: 'yam.dq',
    tnntoday: 'tnntoday'
};

export class YamNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.dq}`, async (req, res) => {
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let crawler = new YamDQNewsCrawler(services);
            let data = await crawler.getNews(limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });

        services.app.get(`/${path.tnntoday}/:section?/:category?/:subcategory?`, async (req, res) => {
            let section = req.params.section ?? '';
            let category = req.params.category ?? '';
            let subcategory = req.params.subcategory ?? '';
            
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let crawler = new TnnTodayNewsCrawler(services);
            let data = await crawler.getNews(section, category, subcategory, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });
    }
}
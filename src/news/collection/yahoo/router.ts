import { ServiceContext } from "../../../services/service";
import { FeedBuilder } from "../../../feeds/feedBuilder";
import { YahooNewsCrawler } from "./yahooNews";

const path = {
    yahoo: 'yahoo.tw'
}

export class YahooTwNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.yahoo}/news/category/:category?/:source?`, async (req, res) => {
            let category = req.params.category ?? 'all';
            let source = req.params.source ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let crawler = new YahooNewsCrawler(services);
            let data = await crawler.getNews(category, source, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items).setOpenCC(opencc);
            res.send(feedBuilder.create());
        });

        services.app.get(`/${path.yahoo}/news/rss/:category?`, async (req, res) => {
            let category = req.params.category ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let crawler = new YahooNewsCrawler(services);
            let data = await crawler.getRssNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items).setOpenCC(opencc);
            res.send(feedBuilder.create());
        });
    }
}
import { ServiceContext } from "../../../services/service";
import { FeedBuilder } from "../../../feeds/feedBuilder";
import { YahooNewsCrawler } from "./yahoo";
import { YahooEDHNewsCrawler } from "./edh";

const path = {
    yahoo: 'yahoo.tw',
    edh: 'edh'
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
            feedBuilder.sendFeedResponse(res);
        });

        services.app.get(`/${path.yahoo}/news/rss/:category?`, async (req, res) => {
            let category = req.params.category ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let crawler = new YahooNewsCrawler(services);
            let data = await crawler.getNewsFromRSS(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items).setOpenCC(opencc);
            feedBuilder.sendFeedResponse(res);
        });

        services.app.get(`/${path.yahoo}/sports/:category?`, async (req, res) => {
            let category = req.params.category ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let crawler = new YahooNewsCrawler(services);
            let data = await crawler.getSportNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items).setOpenCC(opencc);
            feedBuilder.sendFeedResponse(res);
        });

        services.app.get(`/${path.yahoo}/stock/:category?`, async (req, res) => {
            let category = req.params.category ?? 'news';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let crawler = new YahooNewsCrawler(services);
            let data = await crawler.getStockNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items).setOpenCC(opencc);
            feedBuilder.sendFeedResponse(res);
        });

        services.app.get(`/${path.edh}`, async (req, res) => {
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let crawler = new YahooEDHNewsCrawler(services);
            let data = await crawler.getNews(limit);
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items).setOpenCC(opencc);
            feedBuilder.sendFeedResponse(res);
        });
    }
}
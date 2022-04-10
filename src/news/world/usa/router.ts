import { ServiceContext } from "../../../services/service";
import { FeedBuilder } from "../../../feeds/feedBuilder";
import { VOANewsCrawler } from "./voa";
import { WSJNewsCrawler } from "./wsj";


const path = {
    voa: 'voa',
    wsj: 'wsj'
}

export class USANewsRouter {
    public static router(services: ServiceContext) {
        // 美國之音
        services.app.get(`/${path.voa}/:language/category/:category?`, async (req, res) => {
            let category = req.params.category ?? '';
            let language = req.params.language ?? 'zh-hant';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new VOANewsCrawler(services);
            let data = await crawler.getNews(category, language, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
        services.app.get(`/${path.voa}/:language/rss/:rss?`, async (req, res) => {
            let rss = req.params.rss ?? '';
            let language = req.params.language ?? 'zh-hant';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new VOANewsCrawler(services);
            let data = await crawler.getNewsByRss(rss, language, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });

        // 華爾街日報
        services.app.get(`/${path.wsj}/:language/:category?`, async (req, res) => {
            let category = req.params.category ?? '';
            let language = req.params.language ?? 'zh-hant';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new WSJNewsCrawler(services);
            let data = await crawler.getNews(category, language, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
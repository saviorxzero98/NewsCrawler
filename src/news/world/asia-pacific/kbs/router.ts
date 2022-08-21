import { ServiceContext } from "../../../../services/service";
import { FeedBuilder } from "../../../../feeds/feedBuilder";
import { KBSNewsCrawler } from "./kbs";

const path = {
    kbs: 'kbs'
}

export class KBSNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.kbs}/news/:language?/:category?`, async (req, res) => {
            let category = req.params.category ?? '';
            let language = req.params.language ?? 'k';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new KBSNewsCrawler(services);
            let data = await crawler.getNews(category, language, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });

        services.app.get(`/${path.kbs}/today/:language?`, async (req, res) => {
            let language = req.params.language ?? 'k';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new KBSNewsCrawler(services);
            let data = await crawler.getTodayNews(language, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });
    }
}
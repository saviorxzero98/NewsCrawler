import { ServiceContext } from "../../../../services/service";
import { FeedBuilder } from "../../../../feeds/feedBuilder";
import { FTNewsCrawler } from "./ft";

const path = {
    ft: 'ft'
}

export class FTsNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.ft}/:language/:category?`, async (req, res) => {
            let category = req.params.category ?? 'news';
            let language = req.params.language ?? 'zh-hant';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new FTNewsCrawler(services);
            let data = await crawler.getNews(category, language, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
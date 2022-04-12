import { ServiceContext } from "../../../../services/service";
import { FeedBuilder } from "../../../../feeds/feedBuilder";
import { AljazeeraCNNewsCrawler } from "./aljazeera_cn";

const path = {
    aljazeera: 'aljazeera',
}

export class AljazeeraNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.aljazeera}/chinese/:category?`, async (req, res) => {
            let category = req.params.category ?? 'news';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new AljazeeraCNNewsCrawler(services);
            let data = await crawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
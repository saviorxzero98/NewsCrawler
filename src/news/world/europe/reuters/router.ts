import { ServiceContext } from "../../../../services/service";
import { FeedBuilder } from "../../../../feeds/feedBuilder";
import { ReutersZhNewsCrawler } from "./reuters_cn";

const path = {
    uk: 'reuters/uk',
    us: 'reuters/us',
    zh: 'reuters/zh'
}

export class ReutersNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.zh}/:category?`, async (req, res) => {
            let category = req.params.category ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new ReutersZhNewsCrawler(services);
            let data = await crawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
import { ServiceContext } from "../../../../services/service";
import { FeedBuilder } from "../../../../feeds/feedBuilder";
import { NowNewsCrawler } from "./now";

const path = {
    now: 'now',
}

export class NowNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.now}/news/:category?/:id?`, async (req, res) => {
            let category = req.params.category ?? '';
            let id = req.params.id ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new NowNewsCrawler(services);
            let data = await crawler.getNews(category, id, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
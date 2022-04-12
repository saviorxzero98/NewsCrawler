import { ServiceContext } from "../../../../services/service";
import { FeedBuilder } from "../../../../feeds/feedBuilder";
import { NipponHKNewsCrawler } from "./nippon";

const path = {
    nikkei: 'nippon'
}

export class NipponNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.nikkei}/:language/:category?`, async (req, res) => {
            let category = req.params.category ?? 'news';
            let language = req.params.language ?? 'hk';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new NipponHKNewsCrawler(services);
            let data = await crawler.getNews(category, language, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
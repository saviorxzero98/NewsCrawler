import { ServiceContext } from "../../../../services/service";
import { FeedBuilder } from "../../../../feeds/feedBuilder";
import { DWNewsCrawler } from "./dw";

const path = {
    dw: 'dw',
}

export class DWNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.dw}/:language/:category?`, async (req, res) => {
            let category = req.params.category ?? 'all';
            let language = req.params.language ?? 'zh';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new DWNewsCrawler(services);
            let data = await crawler.getNews(category, language, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
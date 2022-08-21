import { ServiceContext } from "../../../../services/service";
import { FeedBuilder } from "../../../../feeds/feedBuilder";
import { RTHKNewsCrawler } from "./rthk";

const path = {
    rthk: 'rthk',
}

export class RTHKNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.rthk}/:category?/:language?`, async (req, res) => {
            let category = req.params.category ?? 'local';
            let language = req.params.language ?? 'hk';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new RTHKNewsCrawler(services);
            let data = await crawler.getNews(category, language, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });
    }
}
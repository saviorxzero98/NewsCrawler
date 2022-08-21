import { ServiceContext } from "../../../../services/service";
import { FeedBuilder } from "../../../../feeds/feedBuilder";
import { WSJNewsCrawler } from "./wsj";

const path = {
    wsj: 'wsj'
}

export class WSJNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.wsj}/:language/:category?`, async (req, res) => {
            let category = req.params.category ?? '';
            let language = req.params.language ?? 'zh-hant';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new WSJNewsCrawler(services);
            let data = await crawler.getNews(category, language, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });
    }
}
import { ServiceContext } from "../../../../services/service";
import { FeedBuilder } from "../../../../feeds/feedBuilder";
import { YNANewsCrawler } from "./yna";

const path = {
    yna: 'yna'
}

export class YNANewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.yna}/:language?/:category?`, async (req, res) => {
            let language = req.params.language ?? '';
            let category = req.params.category ?? 'news';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new YNANewsCrawler(services);
            let data = await crawler.getNews(category, language, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });
    }
}
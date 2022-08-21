import { ServiceContext } from "../../../../services/service";
import { FeedBuilder } from "../../../../feeds/feedBuilder";
import { InmediahkNewsCrawler } from "./inmediahk";

const path = {
    inmediahk: 'inmediahk',
}

export class InmediahkNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.inmediahk}`, async (req, res) => {
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new InmediahkNewsCrawler(services);
            let data = await crawler.getNews(limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });
    }
}
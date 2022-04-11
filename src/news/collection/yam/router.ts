import { ServiceContext } from "../../../services/service";
import { FeedBuilder } from "../../../feeds/feedBuilder";

import { YamDQNewsCrawler } from "./dp";

const path = {
    dq: 'yam.dq'
};

export class YamNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.dq}`, async (req, res) => {
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let crawler = new YamDQNewsCrawler(services);
            let data = await crawler.getNews( limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
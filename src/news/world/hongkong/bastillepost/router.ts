import { ServiceContext } from "../../../../services/service";
import { FeedBuilder } from "../../../../feeds/feedBuilder";
import { BastillePostNewsCrawler } from "./bastillepost";

const path = {
    bastillepost: 'bastillepost',
}

export class BastillePostNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.bastillepost}`, async (req, res) => {
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new BastillePostNewsCrawler(services);
            let data = await crawler.getNews(limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
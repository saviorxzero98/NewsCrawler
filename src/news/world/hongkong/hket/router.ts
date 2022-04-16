import { ServiceContext } from "../../../../services/service";
import { FeedBuilder } from "../../../../feeds/feedBuilder";
import { HKETNewsCrawler } from "./hket";



const path = {
    hket: 'hket',
}

export class HKETNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.hket}/:category?`, async (req, res) => {
            let category = req.params.category ?? 'hongkong';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new HKETNewsCrawler(services);
            let data = await crawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
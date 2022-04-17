import { FeedBuilder } from '../../../feeds/feedBuilder';
import { ServiceContext } from '../../../services/service';
import { TaiwanHotNewsCrawler } from './taiwanhot';

const path = {
    taiwanhot: 'taiwanhot'
}

export class TaiwanHotNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.taiwanhot}/:category?`, async (req, res) => {
            let category = req.params.category ?? '80';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new TaiwanHotNewsCrawler(services);
            let data = await crawler.getNewsByCategory(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
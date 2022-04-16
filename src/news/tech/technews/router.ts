import { FeedBuilder } from '../../../feeds/feedBuilder';
import { ServiceContext } from '../../../services/service';
import { TechNewsNewsCrawler } from './technews';

const path = {
    technews: 'technews'
}

export class TechNewsNewsRouter {
    public static router(services: ServiceContext) {
        // ETToday
        services.app.get(`/${path.technews}/:category?/:subcategory?`, async (req, res) => {
            let category = req.params.category ?? '';
            let subcategory = req.params.subcategory ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new TechNewsNewsCrawler(services);
            let data = await crawler.getNews(category, subcategory, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
import { FeedBuilder } from '../../../feeds/feedBuilder';
import { ServiceContext } from '../../../services/service';
import { HelloYishiNewsCrawler } from './helloyishi';

const path = {
    helloyishi: 'helloyishi'
}

export class HelloYishiNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.helloyishi}/:category/:subcategory?`, async (req, res) => {
            let category = req.params.category ?? '';
            let subcategory = req.params.subcategory ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new HelloYishiNewsCrawler(services);
            let data = await crawler.getNews(category, subcategory, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });
    }
}
import { FeedBuilder } from '../../../feeds/feedBuilder';
import { ServiceContext } from '../../../services/service';
import { IThomeNewsCrawler } from './ithome';

const path = {
    ithome: 'ithome'
}

export class IThomeNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.ithome}`, async (req, res) => {
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new IThomeNewsCrawler(services);
            let data = await crawler.getNews(limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });

        services.app.get(`/${path.ithome}/:category?`, async (req, res) => {
            let category = req.params.category ?? 'news';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new IThomeNewsCrawler(services);
            let data = await crawler.getNewsByCategory(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });
    }
}
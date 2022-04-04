import { FeedBuilder } from '../../feeds/feedBuilder';
import { ChinaTimesNewsCrawler } from './chinatimes';
import { ServiceContext } from '../../service';

const path = 'chinatimes';

export class ChinaTimesNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path}/:category?`, async (req, res) => {
            let category = req.params.category ?? 'realtimenews';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            
            let crawler = new ChinaTimesNewsCrawler(services);
            let data = await crawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
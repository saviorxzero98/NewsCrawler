import { FeedBuilder } from '../../feeds/feedBuilder';
import { ChinaTimesNewsCrawler } from './chinatimes';
import { ServiceContext } from '../../app';


const path = 'chinatimes';

export class ChinaTimesNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path}/:category?`, async (req, res) => {
            let category = req.params.category ?? 'realtimenews';
            let limit = Number(req.query.limit ?? 15);
            
            let data = await ChinaTimesNewsCrawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
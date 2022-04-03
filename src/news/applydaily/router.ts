import { AppleDailyNewsCrawler } from './applydaily';
import { FeedBuilder } from '../../feeds/feedBuilder';
import { ServiceContext } from '../../app';


const path = 'applydaily';

export class AppleDailyNewsRouter {
    public static router(services: ServiceContext) {

        services.app.get(`/${path}/:category?`, async (req, res) => {
            let category = req.params.category ?? 'new';
            let limit = Number(req.query.limit ?? 15);
            
            let crawler = new AppleDailyNewsCrawler(services);
            let data = await crawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
import { FeedBuilder } from '../../feeds/feedBuilder';
import { ServiceContext } from '../../service';
import { LTNNewsCrawler } from './ltn';


const path = {
    ltn: 'ltn'
};

export class LTNNewsRouter {
    public static router(services: ServiceContext) {

        services.app.get(`/${path.ltn}/:category?`, async (req, res) => {
            let category = req.params.category ?? 'all';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            
            let crawler = new LTNNewsCrawler(services);
            let data = await crawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
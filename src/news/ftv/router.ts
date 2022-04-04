import { FTVNewsCrawler } from './ftvnews';
import { FeedBuilder } from '../../feeds/feedBuilder';
import { ServiceContext } from '../../app';

const path = 'ftv';

export class FTVNewsNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path}/:tag?`, async (req, res) => {
            let tag = req.params.tag ?? 'realtime';
            let limit = Number(req.query.limit ?? 15);
            
            let crawler = new FTVNewsCrawler(services);
            let data = await crawler.getNews(tag, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
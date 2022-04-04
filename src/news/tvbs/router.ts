import { FeedBuilder } from '../../feeds/feedBuilder';
import { TVBSNewsCrawler } from './tvbs';
import { ServiceContext } from '../../app';


const path = 'tvbs';

export class TVBSNewsRouter {
    public static router(services: ServiceContext) {

        services.app.get(`/${path}/:category?`, async (req, res) => {
            let category = req.params.category ?? 'realtime';
            let limit = Number(req.query.limit ?? 15);

            let crawler = new TVBSNewsCrawler(services);
            let data = await crawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
import { FeedBuilder } from '../../feeds/feedBuilder';
import { SETNewsCrawler } from './setn';
import { ServiceContext } from '../../service';


const path = 'setn';

export class SETNewsRouter {
    public static router(services: ServiceContext) {

        services.app.get(`/${path}/:page?`, async (req, res) => {
            let page = req.params.page ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);

            let crawler = new SETNewsCrawler(services);
            let data = await crawler.getNews(page, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
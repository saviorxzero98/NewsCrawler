import { FeedBuilder } from '../../feeds/feedBuilder';
import { ServiceContext } from '../../service';
import { HealthMediaNewsCrawler } from './healthmedia';

const heathMediaPath = 'healthmedia';

export class HeathNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${heathMediaPath}/:category?/:id?`, async (req, res) => {
            let category = req.params.category ?? '1';
            let id = req.params.id ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            
            let crawler = new HealthMediaNewsCrawler(services);
            let data = await crawler.getNews(category, id, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
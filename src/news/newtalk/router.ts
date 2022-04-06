import { FeedBuilder } from '../../feeds/feedBuilder';
import { NewtalkNewsCrawler } from './newtalk';
import { ServiceContext } from '../../services/service';

const path = 'newtalk';

export class NewtalkNewsRouter {
    public static router(services: ServiceContext) {

        services.app.get(`/${path}/:category?/:topic?`, async (req, res) => {
            let category = req.params.category ?? '';
            let topic = req.params.topic ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);

            let crawler = new NewtalkNewsCrawler(services);
            let data = await crawler.getNews(category, topic, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
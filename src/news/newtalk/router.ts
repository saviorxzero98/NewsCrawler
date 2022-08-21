import { FeedBuilder } from '../../feeds/feedBuilder';
import { NewtalkNewsCrawler } from './newtalk';
import { ServiceContext } from '../../services/service';

const path = {
    newtalk: 'newtalk'
};

export class NewtalkNewsRouter {
    public static router(services: ServiceContext) {

        services.app.get(`/${path.newtalk}/:category?/:topic?`, async (req, res) => {
            let category = req.params.category ?? '';
            let topic = req.params.topic ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new NewtalkNewsCrawler(services);
            let data = await crawler.getNews(category, topic, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });
    }
}
import { FeedBuilder } from '../../feeds/feedBuilder';
import { ServiceContext } from '../../services/service';
import { StormNewsCrawler } from './storm';

const path = {
    storm: 'storm'
}

export class StormNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.storm}/:category?/:id?`, async (req, res) => {
            let category = req.params.category ?? 'articles';
            let id = req.params.id ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new StormNewsCrawler(services);
            let data = await crawler.getNews(category, id, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });
    }
}
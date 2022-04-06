import { FeedBuilder } from '../../feeds/feedBuilder';
import { ServiceContext } from '../../services/service';
import { CTSNewsCrawler } from './cts';
import { PTSNewsCrawler } from './pts';

const path = {
    cts: 'cts',
    pts: 'pts'
}

export class TBSNewsRouter {
    public static router(services: ServiceContext) {

        services.app.get(`/${path.cts}/:page?`, async (req, res) => {
            let page = req.params.page ?? 'real';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);

            let crawler = new CTSNewsCrawler(services);
            let data = await crawler.getNews(page, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });

        services.app.get(`/${path.pts}/:category?`, async (req, res) => {
            let category = req.params.category ?? '';
             let limit = Number(req.query.limit ?? services.config.maxRssCount);

            let crawler = new PTSNewsCrawler(services);
            let data = await crawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
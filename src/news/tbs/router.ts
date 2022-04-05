import { FeedBuilder } from '../../feeds/feedBuilder';
import { ServiceContext } from '../../service';
import { CTSNewsCrawler } from './cts';
import { PTSNewsCrawler } from './pts';


const ctsPath = 'cts';
const ptsPath = 'pts';

export class TBSNewsRouter {
    public static router(services: ServiceContext) {

        services.app.get(`/${ctsPath}/:page?`, async (req, res) => {
            let page = req.params.page ?? 'real';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);

            let crawler = new CTSNewsCrawler(services);
            let data = await crawler.getNews(page, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });

        services.app.get(`/${ptsPath}/:category?`, async (req, res) => {
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
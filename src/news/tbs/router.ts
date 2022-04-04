import { FeedBuilder } from '../../feeds/feedBuilder';
import { CTSNewsCrawler } from './cts';
import { ServiceContext } from '../../app';


const ctsPath = 'cts';

export class TBSNewsRouter {
    public static router(services: ServiceContext) {

        services.app.get(`/${ctsPath}/:page?`, async (req, res) => {
            let page = req.params.page ?? 'real';
            let limit = Number(req.query.limit ?? 15);

            let crawler = new CTSNewsCrawler(services);
            let data = await crawler.getNews(page, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
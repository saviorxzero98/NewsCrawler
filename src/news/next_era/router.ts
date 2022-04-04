import { FeedBuilder } from '../../feeds/feedBuilder';
import { ERANewsCrawler } from './era';
import { NextTVNewsCrawler } from './nexttv';
import { ServiceContext } from '../../service';


const eraPath = 'era';
const nexttvPath = 'nexttv';

export class NextEraNewsRouter {
    public static router(services: ServiceContext) {

        services.app.get(`/${eraPath}/:category?`, async (req, res) => {
            let category = req.params.category ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);

            let crawler = new ERANewsCrawler(services);
            let data = await crawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });

        services.app.get(`/${nexttvPath}/:category?`, async (req, res) => {
            let category = req.params.category ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);

            let crawler = new NextTVNewsCrawler(services);
            let data = await crawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
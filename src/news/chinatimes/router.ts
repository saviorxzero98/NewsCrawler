import { FeedBuilder } from '../../feeds/feedBuilder';
import { ChinaTimesNewsCrawler } from './chinatimes';
import { ServiceContext } from '../../services/service';
import { CtwantNewsCrawler } from './ctwant';

const path = {
    chinatimes: 'chinatimes',
    ctwant: 'ctwant'
}
export class ChinaTimesNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.chinatimes}/:category?`, async (req, res) => {
            let category = req.params.category ?? 'realtimenews';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            
            let crawler = new ChinaTimesNewsCrawler(services);
            let data = await crawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });

        services.app.get(`/${path.ctwant}/:category?/:subcategory?`, async (req, res) => {
            let category = req.params.category ?? '最新';
            let subcategory = req.params.subcategory ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            
            let crawler = new CtwantNewsCrawler(services);
            let data = await crawler.getNews(category, subcategory, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
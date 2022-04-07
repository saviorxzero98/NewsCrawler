import { FeedBuilder } from '../../../feeds/feedBuilder';
import { ServiceContext } from '../../../services/service';
import { QooAppNewsCrawler } from './qooapp';

const path = {
    qooapp: 'qooapp'
}
export class QooAppNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.qooapp}/news/:category?`, async (req, res) => {
            let category = req.params.category ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let crawler = new QooAppNewsCrawler(services);
            let data = await crawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });

        services.app.get(`/${path.qooapp}/category/:category?/:subcategory?`, async (req, res) => {
            let category = req.params.category ?? '';
            let subcategory = req.params.subcategory ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let crawler = new QooAppNewsCrawler(services);
            let data = await crawler.getNewsByCategory(category, subcategory, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
import { FeedBuilder } from '../../feeds/feedBuilder';
import { ServiceContext } from '../../services/service';
import { HealthMediaNewsCrawler } from './healthmedia/healthmedia';

const path = {
    healthMedia: 'healthmedia'
}

export class HeathNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.healthMedia}/:category?/:id?`, async (req, res) => {
            let category = req.params.category ?? '1';
            let id = req.params.id ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let crawler = new HealthMediaNewsCrawler(services);
            let data = await crawler.getNews(category, id, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
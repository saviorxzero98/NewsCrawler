import { FeedBuilder } from '../../../feeds/feedBuilder';
import { ServiceContext } from '../../../services/service';
import { SportSVNewsCrawler } from './sportsv';

const path = {
    sportsv: 'sportsv'
}

export class SportSVNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.sportsv}/:category?/:subcategory?`, async (req, res) => {
            let category = req.params.category ?? '';
            let subcategory = req.params.subcategory ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let crawler = new SportSVNewsCrawler(services);
            let data = await crawler.getNews(category, subcategory, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
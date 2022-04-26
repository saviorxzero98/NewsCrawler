import { FeedBuilder } from '../../../feeds/feedBuilder';
import { ServiceContext } from '../../../services/service';
import { Top1HealthNewsCrawler } from './top1health';

const path = {
    top1health: 'top1health'
}

export class Top1HealthNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.top1health}/:category?/:subcategory?`, async (req, res) => {
            let category = req.params.category ?? 'Recent';
            let subcategory = req.params.subcategory ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new Top1HealthNewsCrawler(services);
            let data = await crawler.getNews(category, subcategory, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
import { FeedBuilder } from '../../feeds/feedBuilder';
import { ServiceContext } from '../../services/service';
import { SETNewsCrawler } from './setn';


const path = {
    setn: 'setn'
}

export class SETNewsRouter {
    public static router(services: ServiceContext) {

        services.app.get(`/${path.setn}/:page?`, async (req, res) => {
            let page = req.params.page ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new SETNewsCrawler(services);
            let data = await crawler.getNews(page, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
import { FeedBuilder } from '../../feeds/feedBuilder';
import { TVBSNewsCrawler } from './tvbs';
import { ServiceContext } from '../../services/service';


const path = {
    tvbs: 'tvbs'
}

export class TVBSNewsRouter {
    public static router(services: ServiceContext) {

        services.app.get(`/${path.tvbs}/:category?`, async (req, res) => {
            let category = req.params.category ?? 'realtime';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new TVBSNewsCrawler(services);
            let data = await crawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
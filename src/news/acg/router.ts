import { FeedBuilder } from '../../feeds/feedBuilder';
import { ServiceContext } from '../../services/service';

import { GamerGNNNewsCrawler } from './gamer_gnn';

const path = {
    gamerGnn: 'gamer/gnn',
}
export class ACGNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.gamerGnn}/:category?`, async (req, res) => {
            let category = req.params.category ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let crawler = new GamerGNNNewsCrawler(services);
            let data = await crawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
import { FeedBuilder } from '../../../feeds/feedBuilder';
import { ServiceContext } from '../../../services/service';
import { GamebaseNewsCrawler } from './gamebase';

const path = {
    gamebase: 'gamebase'
}
export class GamebaseNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.gamebase}/:tag?`, async (req, res) => {
            let tag = req.params.tag ?? 'game';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let crawler = new GamebaseNewsCrawler(services);
            let data = await crawler.getNews(tag, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
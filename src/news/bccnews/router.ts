import { FeedBuilder } from '../../feeds/feedBuilder';
import { ServiceContext } from '../../services/service';

import { BCCNewsCrawler } from './bccnews';


const path = {
    bcc: 'bccnews'
};

export class BCCNewsRouter {
    public static router(services: ServiceContext) {

        services.app.get(`/${path.bcc}/:category?`, async (req, res) => {
            let category = req.params.category ?? 'z2';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let crawler = new BCCNewsCrawler(services);
            let data = await crawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
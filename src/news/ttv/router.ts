import { TTVNewsCrawler } from './ttv';
import { FeedBuilder } from '../../feeds/feedBuilder';
import { ServiceContext } from '../../services/service';


const path = {
    ttv: 'ttv'
}

export class TTVNewsRouter {
    public static router(services: ServiceContext) {

        services.app.get(`/${path.ttv}/:category?`, async (req, res) => {
            let category = req.params.category;
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new TTVNewsCrawler(services);
            if (category) {
                let data = await crawler.getNewsByCategory(category, limit);
                let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
                feedBuilder = feedBuilder.addItems(data.items);
                res.send(feedBuilder.create());
            }
            else {
                let data = await crawler.getNews(limit);
                let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
                feedBuilder = feedBuilder.addItems(data.items);
                res.send(feedBuilder.create());
            }
        });
    }
}
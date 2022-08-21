import { TTVNewsCrawler } from './ttv';
import { FeedBuilder } from '../../feeds/feedBuilder';
import { ServiceContext } from '../../services/service';


const path = {
    ttv: 'ttv'
}

export class TTVNewsRouter {
    public static router(services: ServiceContext) {
        let crawler = new TTVNewsCrawler(services);

        services.app.get(`/${path.ttv}`, async (req, res) => {
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            
            let data = await crawler.getNews(limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });

        services.app.get(`/${path.ttv}/category/:category?`, async (req, res) => {
            let category = req.params.category;
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let data = await crawler.getNewsByCategory(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });

        services.app.get(`/${path.ttv}/tag/:tag?`, async (req, res) => {
            let tag = req.params.tag;
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let data = await crawler.getNewsByTag(tag, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });
    }
}
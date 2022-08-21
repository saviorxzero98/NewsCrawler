import { FeedBuilder } from '../../../feeds/feedBuilder';
import { ServiceContext } from '../../../services/service';
import { CWNewsCrawler } from './cw';


const path = {
    cw: 'cw'
}

export class CWNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.cw}`, async (req, res) => {
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new CWNewsCrawler(services);
            let data = await crawler.getTodayNews(limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });

        services.app.get(`/${path.cw}/channel/:channel?`, async (req, res) => {
            let channel = req.params.channel ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new CWNewsCrawler(services);
            let data = await crawler.getNewsByChannel(channel, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });

        services.app.get(`/${path.cw}/subchannel/:subchannel?`, async (req, res) => {
            let subchannel = req.params.subchannel ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new CWNewsCrawler(services);
            let data = await crawler.getNewsBySubChannel(subchannel, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });
    }
}
import { FeedBuilder } from '../../../feeds/feedBuilder';
import { ServiceContext } from '../../../services/service';
import { MeritTimesNewsCrawler } from './merittimes';

const path = {
    merittimes: 'merittimes'
}

export class MeritTimesNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.merittimes}/:classid?`, async (req, res) => {
            let classid = req.params.classid ?? '7';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new MeritTimesNewsCrawler(services);
            let data = await crawler.getNews(classid, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });
    }
}
import { AppleDailyNewsCrawler } from './applydaily';
import { FeedBuilder } from '../../feeds/feedBuilder';
import { ServiceContext } from '../../services/service';


const path = {
    appledaily: 'appledaily'
}

export class AppleDailyNewsRouter {
    public static router(services: ServiceContext) {

        services.app.get(`/${path.appledaily}/:category?`, async (req, res) => {
            let category = req.params.category ?? 'new';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let crawler = new AppleDailyNewsCrawler(services);
            let data = await crawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items).setOpenCC(opencc);
            feedBuilder.sendFeedResponse(res);
        });
    }
}
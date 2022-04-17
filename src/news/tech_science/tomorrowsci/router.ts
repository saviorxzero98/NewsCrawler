import { FeedBuilder } from '../../../feeds/feedBuilder';
import { ServiceContext } from '../../../services/service';
import { TomorrowSciNewsCrawler } from './tomorrowsci';

const path = {
    tomorrowsci: 'tomorrowsci'
}

export class TomorrowSciNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.tomorrowsci}/:category?`, async (req, res) => {
            let category = req.params.category ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new TomorrowSciNewsCrawler(services);
            let data = await crawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
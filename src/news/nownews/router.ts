import { FeedBuilder } from '../../feeds/feedBuilder';
import { NownewsNewsCrawler } from './nownews';
import { ServiceContext } from '../../services/service';


const path = {
    nownews: 'nownews'
};

export class NownewsNewsRouter {
    public static router(services: ServiceContext) {

        services.app.get(`/${path.nownews}/:category?/:subCategory?`, async (req, res) => {
            let category = req.params.category ?? 'breaking';
            let subCategory = req.params.subCategory ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new NownewsNewsCrawler(services);
            let data = await crawler.getNews(category, subCategory, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
import { FeedBuilder } from '../../feeds/feedBuilder';
import { NBATaiwanNewsCrawler } from './nba_tw';
import { WorldJournalNewsCrawler } from './worldjournal';
import { ServiceContext } from '../../services/service';


const path = {
    udn: 'udn',
    nba: 'nba-tw',
    worldjournal: 'worldjournal'
}

export class UDNNewsRouter {
    public static router(services: ServiceContext) {

        services.app.get(`/${path.nba}/:category?`, async (req, res) => {
            let category = req.params.category ?? 'newest';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new NBATaiwanNewsCrawler(services);
            let data = await crawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });

        services.app.get(`/${path.worldjournal}/:category?/:language?`, async (req, res) => {
            let category = req.params.category ?? 'newest';
            let language = req.params.language ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new WorldJournalNewsCrawler(services);
            let data = await crawler.getNews(category, language, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
import { FeedBuilder } from '../../feeds/feedBuilder';
import { NBATaiwanNewsCrawler } from './nba_tw';
import { WorldJournalNewsCrawler } from './worldjournal';
import { ServiceContext } from '../../service';


const udnPath = 'udn';
const nbaPath = 'nba-tw';
const wjPath = 'worldjournal';

export class UDNNewsRouter {
    public static router(services: ServiceContext) {

        services.app.get(`/${nbaPath}/:category?`, async (req, res) => {
            let category = req.params.category ?? 'newest';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);

            let crawler = new NBATaiwanNewsCrawler(services);
            let data = await crawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });

        services.app.get(`/${wjPath}/:category?/:language?`, async (req, res) => {
            let category = req.params.category ?? 'newest';
            let language = req.params.language ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);

            let crawler = new WorldJournalNewsCrawler(services);
            let data = await crawler.getNews(category, language, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
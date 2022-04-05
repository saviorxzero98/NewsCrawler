import { FeedBuilder } from '../../feeds/feedBuilder';
import { ServiceContext } from '../../service';
import { NTDTVTwNewsCrawler } from './ntdtv_tw';
import { NTDTVUsNewsCrawler } from './ntdtv_us';

const path = 'ntdtv';

export class NTDTVNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path}/tw/:category?`, async (req, res) => {
            let category = req.params.category ?? '要聞';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);

            let crawler = new NTDTVTwNewsCrawler(services);
            let data = await crawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });

        services.app.get(`/${path}/us/:language?/:category?`, async (req, res) => {
            let category = req.params.category ?? '';
            let language = req.params.language ?? 'b5';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);

            let crawler = new NTDTVUsNewsCrawler(services);
            let data = await crawler.getNews(category, language, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
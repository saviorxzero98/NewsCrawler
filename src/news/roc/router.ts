import { FeedBuilder } from '../../feeds/feedBuilder';
import { CNANewsCrawler } from './cna';
import { RtiNewsCrawler } from './rti';
import { ServiceContext } from '../../services/service';

const path = {
    cna: 'cna',
    rti: 'rti'
}

export class RocGovNewsRouter {
    public static router(services: ServiceContext) {
        // 中央通訊社 CNA
        services.app.get(`/${path.cna}/:category?`, async (req, res) => {
            let category = req.params.category ?? 'aall';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let crawler = new CNANewsCrawler(services);
            let data = await crawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });

        // Rti 中央廣播電台
        services.app.get(`/${path.rti}/:category?`, async (req, res) => {
            let category = req.params.category ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let crawler = new RtiNewsCrawler(services);
            let data = await crawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
import { FeedBuilder } from '../../../../feeds/feedBuilder';
import { ServiceContext } from '../../../../services/service';
import { NTDTVTwNewsCrawler } from './ntdtv_tw';
import { NTDTVUsNewsCrawler } from './ntdtv_us';

const path = {
    ntdtvTW: 'ntdtv/tw',
    ntdtvUS: 'ntdtv/us'
}

export class NTDTVNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.ntdtvTW}/:category?`, async (req, res) => {
            let category = req.params.category ?? '要聞';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new NTDTVTwNewsCrawler(services);
            let data = await crawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });

        services.app.get(`/${path.ntdtvUS}/:language?/:category?`, async (req, res) => {
            let category = req.params.category ?? '';
            let language = req.params.language ?? 'b5';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new NTDTVUsNewsCrawler(services);
            let data = await crawler.getNews(category, language, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });
    }
}
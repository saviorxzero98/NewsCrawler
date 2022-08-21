import { FeedBuilder } from '../../../feeds/feedBuilder';
import { ServiceContext } from '../../../services/service';
import { NatgeoMediaNewsCrawler } from './natgeomedia';

const path = {
    natgeomedia: 'natgeomedia'
}

export class NatgeoMediaNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.natgeomedia}/:category?`, async (req, res) => {
            let category = req.params.category ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new NatgeoMediaNewsCrawler(services);
            let data = await crawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });
    }
}
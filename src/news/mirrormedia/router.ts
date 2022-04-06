import { FeedBuilder } from '../../feeds/feedBuilder';
import { ServiceContext } from '../../services/service';
import { MirrorMediaNewsCrawler } from './mirrormedia';

const path = {
    mirrormedia: 'mirrormedia'
}

export class MirrorMediaNewsNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.mirrormedia}/:section?/:category?`, async (req, res) => {
            let section= req.params.section ?? 'news';
            let category = req.params.category ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let crawler = new MirrorMediaNewsCrawler(services);
            let data = await crawler.getNews(section, category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
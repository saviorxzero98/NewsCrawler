import { FeedBuilder } from '../../feeds/feedBuilder';
import { ServiceContext } from '../../services/service';
import { MirrorMediaNewsCrawler } from './mirrormedia';

const path = {
    mirrormedia: 'mirrormedia'
}

export class MirrorMediaNewsNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.mirrormedia}`, async (req, res) => {
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let crawler = new MirrorMediaNewsCrawler(services);
            let data = await crawler.getNewsBySection('news', limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
        
        services.app.get(`/${path.mirrormedia}/section/:section?`, async (req, res) => {
            let section= req.params.section ?? 'news';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let crawler = new MirrorMediaNewsCrawler(services);
            let data = await crawler.getNewsBySection(section, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });

        services.app.get(`/${path.mirrormedia}/category/:category?`, async (req, res) => {
            let category = req.params.category ?? 'news';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let crawler = new MirrorMediaNewsCrawler(services);
            let data = await crawler.getNewsByCategory(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
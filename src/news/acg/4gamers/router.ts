import { FeedBuilder } from '../../../feeds/feedBuilder';
import { ServiceContext } from '../../../services/service';

import { FourGamersNewsCrawler } from './4gamers';

const path = {
    gamerGnn: 'gamer/gnn',
    fourGamers: '4gamers'
}
export class FourGamersNewsRouter {
    public static router(services: ServiceContext) {
        let crawler = new FourGamersNewsCrawler(services);

        services.app.get(`/${path.fourGamers}`, async (req, res) => {
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let data = await crawler.getNews(limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });

        services.app.get(`/${path.fourGamers}/category/:category?`, async (req, res) => {
            let category = req.params.category ?? '352';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let data = await crawler.getNewsByCategory(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });

        services.app.get(`/${path.fourGamers}/tag/:tag?`, async (req, res) => {
            let tag = req.params.tag ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let data = await crawler.getNewsByTag(tag, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });

        services.app.get(`/${path.fourGamers}/topic/:topic?`, async (req, res) => {
            let topic = req.params.topic ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let data = await crawler.getNewsByTopic(topic, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
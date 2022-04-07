import { FeedBuilder } from '../../feeds/feedBuilder';
import { ServiceContext } from '../../services/service';

import { FourGamersNewsCrawler } from './4gamer';
import { GamerGNNNewsCrawler } from './gamer_gnn';

const path = {
    gamerGnn: 'gamer/gnn',
    fourGamers: '4gamers'
}
export class ACGNewsRouter {
    public static router(services: ServiceContext) {
        // 巴哈姆特 GNN
        services.app.get(`/${path.gamerGnn}/:category?`, async (req, res) => {
            let category = req.params.category ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let crawler = new GamerGNNNewsCrawler(services);
            let data = await crawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });


        // 4Gamers
        services.app.get(`/${path.fourGamers}/category/:category?`, async (req, res) => {
            let category = req.params.category ?? '352';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let crawler = new FourGamersNewsCrawler(services);
            let data = await crawler.getNewsByCategory(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
        // 4Gamers
        services.app.get(`/${path.fourGamers}/tag/:tag?`, async (req, res) => {
            let tag = req.params.tag ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let crawler = new FourGamersNewsCrawler(services);
            let data = await crawler.getNewsByTag(tag, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
        // 4Gamers
        services.app.get(`/${path.fourGamers}/topic/:topic?`, async (req, res) => {
            let topic = req.params.topic ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let crawler = new FourGamersNewsCrawler(services);
            let data = await crawler.getNewsByTopic(topic, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
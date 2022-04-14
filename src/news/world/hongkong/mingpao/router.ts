import { ServiceContext } from "../../../../services/service";
import { FeedBuilder } from "../../../../feeds/feedBuilder";
import { MingPaoNewsCrawler } from "./mingpao";


const path = {
    mingpao: 'mingpao',
}

export class MingPaoNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.mingpao}/ins/:category?`, async (req, res) => {
            let category = req.params.category ?? 'all';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new MingPaoNewsCrawler(services);
            let data = await crawler.getInsNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });

        services.app.get(`/${path.mingpao}/pns/:category?`, async (req, res) => {
            let category = req.params.category ?? 's00001';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new MingPaoNewsCrawler(services);
            let data = await crawler.getPnsNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });

        services.app.get(`/${path.mingpao}/weather`, async (req, res) => {
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new MingPaoNewsCrawler(services);
            let data = await crawler.getWeatherNews(limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
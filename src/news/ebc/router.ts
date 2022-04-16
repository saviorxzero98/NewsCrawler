import { FeedBuilder } from '../../feeds/feedBuilder';
import { ServiceContext } from '../../services/service';

import { EBCNewsCrawler } from './ebc';
import { EBCFncNewsCrawler } from './ebc_fnc';
import { ETtodayNewsCrawler } from './ettoday';



const path = {
    ebc: 'ebc',
    ettoday: 'ettoday'
}

export class EBCNewsRouter {
    public static router(services: ServiceContext) {
        // 東森新聞
        services.app.get(`/${path.ebc}/news/:category?`, async (req, res) => {
            let category = req.params.category ?? 'realtime';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new EBCNewsCrawler(services);
            let data = await crawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });

        // 東森財經新聞
        services.app.get(`/${path.ebc}/fncnews/:category?`, async (req, res) => {
            let category = req.params.category ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new EBCFncNewsCrawler(services);
            let data = await crawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });

        // ETToday
        services.app.get(`/${path.ettoday}/:category?`, async (req, res) => {
            let category = req.params.category ?? 'realtime';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new ETtodayNewsCrawler(services);
            let data = await crawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
import * as express from 'express';
import { FeedBuilder } from '../../feeds/feedBuilder';
import { SETNewsCrawler } from './setn';
import { ServiceContext } from '../../app';


const path = 'setn';

export class SETNewsRouter {
    public static router(services: ServiceContext) {

        services.app.get(`/${path}/:page?`, async (req, res) => {
            let page = req.params.page ?? '';
            let limit = Number(req.query.limit ?? 15);

            let data = await SETNewsCrawler.getNews(page, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
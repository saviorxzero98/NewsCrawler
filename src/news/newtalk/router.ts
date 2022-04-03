import * as express from 'express';
import { FeedBuilder } from '../../feeds/feedBuilder';
import { NewtalkNewsCrawler } from './newtalk';
import { ServiceContext } from '../../app';

const path = 'newtalk';

export class NewtalkNewsRouter {
    public static router(services: ServiceContext) {

        services.app.get(`/${path}/:category?/:topic?`, async (req, res) => {
            let category = req.params.category ?? '';
            let topic = req.params.topic ?? '';
            let limit = Number(req.query.limit ?? 15);

            let data = await NewtalkNewsCrawler.getNews(category, topic, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
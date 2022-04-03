import * as express from 'express';
import { FeedBuilder } from '../../feeds/feedBuilder';
import { NownewsNewsCrawler } from './nownews';
import { ServiceContext } from '../../app';


const path = 'nownews';

export class NownewsNewsRouter {
    public static router(services: ServiceContext) {

        services.app.get(`/${path}/:category?/:subCategory?`, async (req, res) => {
            let category = req.params.category ?? 'breaking';
            let subCategory = req.params.subCategory ?? '';
            let limit = Number(req.query.limit ?? 15);

            let data = await NownewsNewsCrawler.getNews(category, subCategory, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
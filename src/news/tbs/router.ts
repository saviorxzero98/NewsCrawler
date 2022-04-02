import * as express from 'express';
import { FeedBuilder } from '../../feeds/feedBuilder';
import { CTSNewsCrawler } from './cts';


const path = 'cts';

export class CTSNewsRouter {
    public static router(app: express.Express) {

        app.get(`/${path}`, async (req, res) => {
            let data = await CTSNewsCrawler.getNews();
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });

        app.get(`/${path}/page/:page`, async (req, res) => {
            let page = req.params.page;
            
            if (page) {
                let data = await CTSNewsCrawler.getNews(page);
                let feedBuilder = new FeedBuilder(data.title, data.link);
                feedBuilder = feedBuilder.addItems(data.items);
                res.send(feedBuilder.create());
            }
            else {
                let data = await CTSNewsCrawler.getNews();
                let feedBuilder = new FeedBuilder(data.title, data.link);
                feedBuilder = feedBuilder.addItems(data.items);
                res.send(feedBuilder.create());
            }
        });
    }
}
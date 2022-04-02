import * as express from 'express';
import { TTVNewsCrawler } from './ttv';
import { FeedBuilder } from '../../feeds/feedBuilder';


const path = 'ttv';

export class TTVNewsRouter {
    public static router(app: express.Express) {

        app.get(`/${path}/:category?`, async (req, res) => {
            let category = req.params.category;
            
            if (category) {
                let data = await TTVNewsCrawler.getNewsByCategory(category);
                let feedBuilder = new FeedBuilder(data.title, data.link);
                feedBuilder = feedBuilder.addItems(data.items);
                res.send(feedBuilder.create());
            }
            else {
                let data = await TTVNewsCrawler.getNews();
                let feedBuilder = new FeedBuilder(data.title, data.link);
                feedBuilder = feedBuilder.addItems(data.items);
                res.send(feedBuilder.create());
            }
        });
    }
}
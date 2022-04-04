import { TTVNewsCrawler } from './ttv';
import { FeedBuilder } from '../../feeds/feedBuilder';
import { ServiceContext } from '../../app';


const path = 'ttv';

export class TTVNewsRouter {
    public static router(services: ServiceContext) {

        services.app.get(`/${path}/:category?`, async (req, res) => {
            let category = req.params.category;
            let limit = Number(req.query.limit ?? 15);

            if (category) {
                let data = await TTVNewsCrawler.getNewsByCategory(category, limit);
                let feedBuilder = new FeedBuilder(data.title, data.link);
                feedBuilder = feedBuilder.addItems(data.items);
                res.send(feedBuilder.create());
            }
            else {
                let data = await TTVNewsCrawler.getNews(limit);
                let feedBuilder = new FeedBuilder(data.title, data.link);
                feedBuilder = feedBuilder.addItems(data.items);
                res.send(feedBuilder.create());
            }
        });
    }
}
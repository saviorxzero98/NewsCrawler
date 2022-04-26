import { ServiceContext } from "../../../../services/service";
import { FeedBuilder } from "../../../../feeds/feedBuilder";
import { KyodoNewsZhNewsCrawler } from "./kyodonews_zh";

const path = {
    kyodonews: 'kyodonews'
}

export class KyodoNewsZhRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.kyodonews}/:language/:category?`, async (req, res) => {
            let category = req.params.category ?? '';
            let language = req.params.language ?? 'tchina';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new KyodoNewsZhNewsCrawler(services);
            let data = await crawler.getNews(category, language, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
import { ServiceContext } from "../../../../services/service";
import { FeedBuilder } from "../../../../feeds/feedBuilder";
import { BBCZhNewsCrawler } from "./bbc_zh";

const path = {
    bbcuk: 'bbc/uk',
    bbczh: 'bbc/zh'
}

export class BBCNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.bbczh}/:language`, async (req, res) => {
            let language = req.params.language ?? 'zh-hant';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new BBCZhNewsCrawler(services);
            let data = await crawler.getNews(language, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
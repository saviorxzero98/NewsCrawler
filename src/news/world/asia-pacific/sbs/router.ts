import { ServiceContext } from "../../../../services/service";
import { FeedBuilder } from "../../../../feeds/feedBuilder";
import { SBSZhCNNewsCrawler } from "./sbs_zh";

const path = {
    sbs: 'sbs',
}

export class SBSNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.sbs}/chinese/:category?/:language?`, async (req, res) => {
            let category = req.params.category ?? 'news';
            let language = req.params.language ?? 'zh-hant';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new SBSZhCNNewsCrawler(services);
            let data = await crawler.getNews(category, language, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
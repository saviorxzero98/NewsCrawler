import { ServiceContext } from "../../../../services/service";
import { FeedBuilder } from "../../../../feeds/feedBuilder";
import { NikkeiZhNewsCrawler } from "./nikkei_zh";

const path = {
    nikkei: 'nikkei',
    chs: 'nikkei/zh-hans',
    cht: 'nikkei/zh-hant',
}

export class NikkeiNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.cht}/:category?/:subcategory?`, async (req, res) => {
            let category = req.params.category ?? '';
            let subcategory = req.params.subcategory ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new NikkeiZhNewsCrawler(services);
            let data = await crawler.getNews(category, subcategory, 'zh-hant', limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });

        services.app.get(`/${path.chs}/:category?/:subcategory?`, async (req, res) => {
            let category = req.params.category ?? '';
            let subcategory = req.params.subcategory ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new NikkeiZhNewsCrawler(services);
            let data = await crawler.getNews(category, subcategory, 'zh-hans', limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });
    }
}
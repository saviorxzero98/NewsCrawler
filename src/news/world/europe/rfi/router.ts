import { ServiceContext } from "../../../../services/service";
import { FeedBuilder } from "../../../../feeds/feedBuilder";
import { RfiZhNewsCrawler } from "./rfi_zh";

const path = {
    rfi: 'rfi',
    cn: 'rfi/cn',
    tw: 'rfi/tw'
}

export class RfiNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.tw}/:category?`, async (req, res) => {
            let category = req.params.category ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new RfiZhNewsCrawler(services);
            let data = await crawler.getNews(category, 'tw', limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });

        services.app.get(`/${path.cn}/:category?`, async (req, res) => {
            let category = req.params.category ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new RfiZhNewsCrawler(services);
            let data = await crawler.getNews(category, 'cn', limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });
    }
}
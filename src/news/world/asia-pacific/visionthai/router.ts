import { ServiceContext } from "../../../../services/service";
import { FeedBuilder } from "../../../../feeds/feedBuilder";
import { VisionThaiNewsCrawler } from "./visionthai";


const path = {
    visionthai: 'visionthai',
}

export class VisionThaiNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.visionthai}/:language?/:topic?/:category?`, async (req, res) => {
            let topic = req.params.topic ?? '';
            let category = req.params.category ?? '';
            let language = req.params.language ?? 'zh-hant';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new VisionThaiNewsCrawler(services);
            let data = await crawler.getNews(topic, category, language, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });
    }
}
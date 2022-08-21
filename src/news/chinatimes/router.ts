import { FeedBuilder } from '../../feeds/feedBuilder';
import { ChinaTimesNewsCrawler } from './chinatimes';
import { ServiceContext } from '../../services/service';
import { CtwantNewsCrawler } from './ctwant';
import { CtiTVNewsCrawler } from './ctitv';
import { CTVNewsCrawler } from './ctv';

const path = {
    chinatimes: 'chinatimes',
    ctwant: 'ctwant',
    ctv: 'ctv',
    ctitv: 'ctitv'
}
export class ChinaTimesNewsRouter {
    public static router(services: ServiceContext) {
        services.app.get(`/${path.chinatimes}/:category?/:subcategory?`, async (req, res) => {
            let category = req.params.category ?? 'realtimenews';
            let subcategory = req.params.subcategory ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let crawler = new ChinaTimesNewsCrawler(services);
            let data = await crawler.getNews(category, subcategory, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });

        services.app.get(`/${path.ctwant}/:category?/:subcategory?`, async (req, res) => {
            let category = req.params.category ?? '最新';
            let subcategory = req.params.subcategory ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let crawler = new CtwantNewsCrawler(services);
            let data = await crawler.getNews(category, subcategory, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });

        services.app.get(`/${path.ctv}/news/:category?`, async (req, res) => {
            let category = req.params.category ?? '生活';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let crawler = new CTVNewsCrawler(services);
            let data = await crawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });

        services.app.get(`/${path.ctv}/rss`, async (req, res) => {
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let crawler = new CTVNewsCrawler(services);
            let data = await crawler.getRSSNews(limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });

        services.app.get(`/${path.ctitv}/:category?`, async (req, res) => {
            let category = req.params.category ?? 'instant-overview';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');
            
            let crawler = new CtiTVNewsCrawler(services);
            let data = await crawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });
    }
}
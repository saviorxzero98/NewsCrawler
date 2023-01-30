import { FeedBuilder } from '../../feeds/feedBuilder';
import { NBATaiwanNewsCrawler } from './nba_tw';
import { WorldJournalNewsCrawler } from './worldjournal';
import { ServiceContext } from '../../services/service';
import { UDNNewsCrawler } from './udn';


const path = {
    udn: 'udn/news',
    udnStar: 'udn/star',
    udnHealth: 'udn/health',
    udnGlobal: 'udn/global',
    udnGame: 'udn/game',
    udnOpinion: 'udn/opinion',
    udnMoney: 'udn/money',
    nba: 'nba-tw',
    worldjournal: 'worldjournal'
}

export class UDNNewsRouter {
    public static router(services: ServiceContext) {
        // 聯合新聞網
        services.app.get(`/${path.udn}/:category?/:subcategory?`, async (req, res) => {
            let category = req.params.category ?? 'latest';
            let subcategory = req.params.subcategory ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new UDNNewsCrawler(services);
            let data = await crawler.getNews(category, subcategory, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });

        // 經濟日報
        services.app.get(`/${path.udnMoney}/:category?`, async (req, res) => {
            let category = req.params.category ?? '0';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new UDNNewsCrawler(services);
            let data = await crawler.getMoneyNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });

        // 噓！星聞
        services.app.get(`/${path.udnStar}/:category?`, async (req, res) => {
            let category = req.params.category ?? '10088';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new UDNNewsCrawler(services);
            let data = await crawler.getStarNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });

        // 元氣網
        services.app.get(`/${path.udnHealth}/:category?/:subcategory?`, async (req, res) => {
            let category = req.params.category ?? '5681';
            let subcategory = req.params.subcategory ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new UDNNewsCrawler(services);
            //let data = await crawler.getHealthRssNews(category, subcategory, limit);
            let data = await crawler.getHealthNews(category, subcategory, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });

        // 轉角國際
        services.app.get(`/${path.udnGlobal}/:category?`, async (req, res) => {
            let category = req.params.category ?? '8662';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new UDNNewsCrawler(services);
            let data = await crawler.getGlobalNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });

        // 遊戲角落
        services.app.get(`/${path.udnGame}/:category?`, async (req, res) => {
            let category = req.params.category ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new UDNNewsCrawler(services);
            let data = await crawler.getGameNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });

        // 名人堂
        services.app.get(`/${path.udnOpinion}/:category?`, async (req, res) => {
            let category = req.params.category ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new UDNNewsCrawler(services);
            let data = await crawler.getOpinionNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });

        // NBA 台灣
        services.app.get(`/${path.nba}/:category?`, async (req, res) => {
            let category = req.params.category ?? 'newest';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new NBATaiwanNewsCrawler(services);
            let data = await crawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });

        // 世界新聞網
        services.app.get(`/${path.worldjournal}/:category?/:language?`, async (req, res) => {
            let category = req.params.category ?? 'newest';
            let language = req.params.language ?? '';
            let limit = Number(req.query.limit ?? services.config.maxRssCount);
            let opencc = String(req.query.opencc ?? '');

            let crawler = new WorldJournalNewsCrawler(services);
            let data = await crawler.getNews(category, language, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link).setOpenCC(opencc);
            feedBuilder = feedBuilder.addItems(data.items);
            feedBuilder.sendFeedResponse(res);
        });
    }
}
import * as express from 'express';
import { FeedBuilder } from '../../feeds/feedBuilder';
import { EBCNewsCrawler } from './ebc';
import { EBCFncNewsCrawler } from './ebc_fnc';
import { ETtodayNewsCrawler } from './ettoday';
import { ServiceContext } from '../../app';


const ebcPath = 'ebc';
const ettodayPath = 'ettoday';

export class EBCNewsRouter {
    public static router(services: ServiceContext) {
        // 東森新聞
        services.app.get(`/${ebcPath}/news/:category?`, async (req, res) => {
            let category = req.params.category ?? 'realtime';
            let limit = Number(req.query.limit ?? 15);
            let data = await EBCNewsCrawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });

        // 東森財經新聞
        services.app.get(`/${ebcPath}/fncnews/:category?`, async (req, res) => {
            let category = req.params.category ?? '';
            let limit = Number(req.query.limit ?? 15);
            let data = await EBCFncNewsCrawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });

        // ETToday
        services.app.get(`/${ettodayPath}/:category?`, async (req, res) => {
            let category = req.params.category ?? 'realtime';
            let limit = Number(req.query.limit ?? 15);
            let data = await ETtodayNewsCrawler.getNews(category, limit);
            let feedBuilder = new FeedBuilder(data.title, data.link);
            feedBuilder = feedBuilder.addItems(data.items);
            res.send(feedBuilder.create());
        });
    }
}
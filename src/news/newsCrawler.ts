import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';
import { Item } from 'feed';
import * as parser from 'rss-parser';

import { ServiceContext } from "../services/service";


const httpClient = axios.default;

export type NewsListOptions = {
    url: string,
    options?: any,
    count?: number,
    crawlers?: NewsItemCrawler[]
}

export type NewsItemCrawler = {
    selector: string,
    callback: ($: cheerio.CheerioAPI, i: any) => any
}

export type RSSNewsListOptions = {
    url: string,
    count: number
}

export type NewsDetialOptions = {
    options?: any,
    list: Item[],
    callback: (item: Item, content: cheerio.CheerioAPI, res: any) => any
}


export abstract class NewsCrawler {
    protected services: ServiceContext;
    constructor(services: ServiceContext) {
        this.services = services;
    }

    protected async getNewsList(options: NewsListOptions): Promise<Item[]> {
        this.services.logger.logGetUrl(options.url);
        
        let response = await httpClient.get(options.url, options.options);
        let content = cheerio.load(response.data);

        let list = [];

        for (let crawler of options.crawlers) {
            let partList = content(crawler.selector)
                               .map((_, item) => crawler.callback(content, item))
                               .get()
            list.push(...partList);
        }

        return list.filter(i => i.title && i.link)
                   .slice(0, options.count);
    }

    protected async getNewsDetials(options: NewsDetialOptions): Promise<Item[]> {
        let items = await Promise.all(
            options.list.map(async (item) => 
                this.services
                    .cache
                    .tryGet<Item>(item.link, async () => {
                        let detailResponse = await httpClient.get(item.link, options.options);
                        let content = cheerio.load(detailResponse.data);
                        return options.callback(item, content, detailResponse);
                    })
            )
        );
        return items;
    }

    protected async getRSSNewsList(options: RSSNewsListOptions): Promise<Item[]> {
        let data = await this.getRSSNewsData(options.url);

        let list = [];
        for (let item of data.items) {
            list.push({
                title: item.title,
                link: item.link,
                description: item.content,
                date: moment(item.isoDate, 'YYYY-MM-DDTHH:mm:ss').toDate()
            })
        }
        return list.slice(0, options.count);
    }

    protected async getNewsWeb(url: string, options ?: any) {
        this.services.logger.logGetUrl(options.url);
        
        let response = await httpClient.get(options.url, options.options);
        return response;
    }

    protected async getRSSNewsData(url: string) {
        this.services.logger.logGetRssUrl(url);

        let feedParser = new parser();
        let data = await feedParser.parseURL(url);

        return data;
    }
}
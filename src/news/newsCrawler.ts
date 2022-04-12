import * as cheerio from 'cheerio';
import * as moment from 'moment';
import { Item } from 'feed';
import * as parser from 'rss-parser';

import { ServiceContext } from "../services/service";
import { HttpClient } from '../services/httpclient';

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

    /** 取得 News List */
    public async getNewsList(options: NewsListOptions): Promise<Item[]> {
        this.services.logger.logGetUrl(options.url);
        
        let httpClient = new HttpClient();
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

    /** 取得 News Detial */
    public async getNewsDetials(options: NewsDetialOptions): Promise<Item[]> {
        let items = await Promise.all(
            options.list.map(async (item) => 
                this.services
                    .cache
                    .tryGet<Item>(item.link, async () => {
                        try {
                            let httpClient = new HttpClient();
                            let detailResponse = await httpClient.get(item.link, options.options);
                            let content = cheerio.load(detailResponse.data);
                            return options.callback(item, content, detailResponse);
                        }
                        catch (e) {
                            //this.services.logger.logError(e);
                            this.services.logger.logError(`Get News Detial Error. ${item.link}`);
                            return item;
                        }
                    })
            )
        );
        return items;
    }

    /** 取得 News List (透過 RSS) */
    public async getNewsListFromRSS(options: RSSNewsListOptions): Promise<Item[]> {
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

    protected async getNewsWeb(url: string, headers ?: any) {
        this.services.logger.logGetUrl(url);
        
        let httpClient = new HttpClient();
        let response = await httpClient.get(url, headers);
        return response;
    }

    protected async getRSSNewsData(url: string) {
        this.services.logger.logGetRssUrl(url);

        let feedParser = new parser();
        let data = await feedParser.parseURL(url);

        return data;
    }
}
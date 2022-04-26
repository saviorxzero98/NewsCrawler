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

export type NewsDetialOptions = {
    headers?: any,
    list: Item[],
    callback: (item: Item, content: cheerio.CheerioAPI, newsMeta: NewsMeta, res: any) => any
}

export type NewsMeta = {
    title ?: string,
    url ?: string,
    image ?: string,
    description ?: string,
    pubDate ?: Date
}

export enum NewsMetaTag {
    title = 'meta[property="og:title"]',
    url = 'meta[property="og:url"]',
    description = 'meta[property="og:description"]',
    image = 'meta[property="og:image"]',

    twitterTitle = 'meta[name="twitter:title"]',
    twitterUrl = 'meta[name="twitter:url"]',

    twitterDescription = 'meta[name="twitter:description"]',
    twitterImage = 'meta[name="twitter:image"]',
    twitterImageSrc = 'meta[name="twitter:image:src"]',

    pubDate = 'meta[property="article:published_time"]'
}

export type RSSNewsListOptions = {
    url: string,
    headers?: any,
    count: number,
    callback?: (item: any) => any
}

export type RSSNewsResults = {
    title ?: string,
    link ?: string,
    list ?: Item[],
    rssData ?: any
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
                            let detailResponse = await httpClient.get(item.link, options.headers);
                            let content = cheerio.load(detailResponse.data);
                            let metaInfo = this.getNewsMetaInfo(content);
                            return options.callback(item, content, metaInfo, detailResponse);
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

    private getNewsMetaInfo(content: cheerio.CheerioAPI) {
        let title = content(NewsMetaTag.title).attr('content') ?? 
                    content(NewsMetaTag.twitterTitle).attr('content') ?? '';
        let url = content(NewsMetaTag.url).attr('content') ??
                  content(NewsMetaTag.twitterUrl).attr('content') ?? '';
        let description = content(NewsMetaTag.description).attr('content') ??
                          content(NewsMetaTag.twitterDescription).attr('content') ?? '';
        let image = content(NewsMetaTag.image).attr('content') ??
                    content(NewsMetaTag.twitterImage).attr('content') ??
                    content(NewsMetaTag.twitterImageSrc).attr('content') ?? '';
        let pubDate = content(NewsMetaTag.pubDate).attr('content') ?? '';

        let meta: NewsMeta = {
            title,
            url,
            description,
            image
        }

        if (pubDate) {
            meta.pubDate = new Date(pubDate);
        }

        return meta;
    }

    /** 取得 News List (透過 RSS) */
    public async getNewsListFromRSS(options: RSSNewsListOptions): Promise<RSSNewsResults> {
        let data = await this.getRssData(options.url, options.headers);
        
        let list = [];
        for (let item of data.items) {
            let newItem = item;
            if (options.callback) {
                newItem = options.callback(item);
            }

            list.push({
                title: newItem.title,
                link: newItem.link,
                description: newItem.content,
                date: new Date(newItem.isoDate)
            })
        }
        list = list.slice(0, options.count);

        return {
            title: data.title,
            link: data.link,
            list,
            rssData: data
        }
    }

    /** 取得 RSS Data */
    protected async getRssData(url: string, headers?: any) {
        this.services.logger.logGetRssUrl(url);

        let feedParser = new parser();
        if (headers) {
            let httpClient = new HttpClient();
            let response = await httpClient.get(url, headers);
            let rssData = await feedParser.parseString(response.data);
            return rssData;
        }
        else {
            let rssData = await feedParser.parseURL(url);
            return rssData;
        }
    }


    /** 取得 Map Value */
    protected tryGetMapValue(map: any, key: string) {
        if (map && key) {
            let keyname = key.toLowerCase();
            let value = map[Object.keys(map).find(k => k.toLowerCase() === keyname)];
            return value;
        }
        return null;
    }

    /** 取得 Map Value */
    protected tryGetMapKey(map: any, key: string) {
        if (map && key) {
            let keyname = key.toLowerCase();
            return Object.keys(map).find(k => k.toLowerCase() === keyname);
        }
        return '';
    }
}

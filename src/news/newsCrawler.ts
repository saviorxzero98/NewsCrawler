import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';
import { Item } from 'feed';
import * as parser from 'rss-parser';

import { ServiceContext } from "../service";


const httpClient = axios.default;

export type NewsListOptions = {
    url: string,
    options?: any,
    selector: string,
    count?: number,
    callback: ($: cheerio.CheerioAPI, i: any) => Item,
}

export type RSSNewsListOptions = {
    url: string,
    count: number
}

export type NewsDetialOptions = {
    options?: any,
    list: Item[],
    callback: (item: Item, content: cheerio.CheerioAPI) => Item
}


export abstract class NewsCrawler {
    protected services: ServiceContext;
    constructor(services: ServiceContext) {
        this.services = services;
    }

    public async getNewsList(options: NewsListOptions): Promise<Item[]> {
        
        console.log(`GET ${options.url}`);

        let response = await httpClient.get(options.url, options.options);
        let content = cheerio.load(response.data);
        let list = content(options.selector)
            .map((_, item) => options.callback(content, item))
            .get()
            .filter(i => i.title && i.link)
            .slice(0, options.count);
        return list;
    }

    public async getNewsDetials(options: NewsDetialOptions): Promise<Item[]> {
        let items = await Promise.all(
            options.list.map(async (item) => 
                this.services
                    .cache
                    .tryGet<Item>(item.link, async () => {
                        let detailResponse = await httpClient.get(item.link, options.options);
                        let content = cheerio.load(detailResponse.data);
                        return options.callback(item, content);
                    })
            )
        );
        return items;
    }

    public async getRSSNewsList(options: RSSNewsListOptions): Promise<Item[]> {
        console.log(`GET RSS ${options.url}`);

        let feedParser = new parser();
        let data = await feedParser.parseURL(options.url);
        
        let list = [];
        for (let item of data.items) {
            list.push({
                title: item.title,
                link: item.link,
                description: item.content,
                date: moment(item.isoDate, 'YYYY-MM-DDTHH:mm:ss').toDate()
            })
        }
        return list;
    }
}
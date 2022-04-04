import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';
import { Item } from "feed";

import { ServiceContext } from '../../app';
import * as utils from '../../feeds/utils';

const httpClient = axios.default;

const rootUrl = 'https://news.ttv.com.tw';
const title = '台視新聞';

export enum TTVChannel {
    realtime = '即時'
}

export class TTVNewsCrawler {
    private services: ServiceContext;
    constructor(services: ServiceContext) {
        this.services = services;
    }
    
    public async getNews(count: number = 15) {
        let url = `${rootUrl}/realtime`;
        console.log(`GET ${url}`);

        let response = await httpClient.get(url, utils.crawlerOptions);
        let list = this.getTTVNews(response.data, count);

        return {
            title: `${title}`,
            link: url,
            items: list,
        };
    }

    public async getNewsByCategory(category: string, count: number = 10) {
        let url = `${rootUrl}/category/${encodeURIComponent(category)}`;
        console.log(`GET ${url}`);
        
        let response = await httpClient.get(url, utils.crawlerOptions);
        let list = this.getTTVNews(response.data, count);
        
        return {
            title: `${title} - ${category}`,
            link: url,
            items: list,
        };
    }

    private getTTVNews(data: any, count: number): Item[] {
        let $ = cheerio.load(data);
        let list = $('article.container div.news-list ul li')
            .map((_, i) => {
                let title = $(i).find('a div.title').text();
                let link = $(i).find('a').attr('href');
                let image = $(i).find('a img').attr('src');
                let description = $(i).find('div.summary').text();
                let pubDate = $(i).find('div.time').text();
                let item: Item = {
                    title,
                    description,
                    link,
                    image,
                    date: moment(pubDate, 'YYYY.MM.DD HH:mm').toDate(),
                };
                return item;
            })
            .get()
            .filter(item => item && item.title && item.link)
            .slice(0, count);

        return list;
    }
}
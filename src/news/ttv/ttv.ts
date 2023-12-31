import * as cheerio from 'cheerio';

import { crawlerHeaders } from '../../services/httpclient';
import { ServiceContext } from '../../services/service';
import { NewsCrawler } from '../newsCrawler';

const rootUrl = 'https://news.ttv.com.tw';
const title = '台視新聞';

export enum TTVChannel {
    realtime = '即時'
}

export class TTVNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }
    
    public async getNews(count: number = 15) {
        let url = `${rootUrl}/realtime`;

        let crawler = {
            selector: 'article.container div.news-list ul li',
            callback: ($, i) => this.getTTVNews($, i)
        };
        let list = await this.getNewsList({
            url,
            options: crawlerHeaders,
            count,
            crawlers: [ crawler ]
        });

        return {
            title: `${title}`,
            link: url,
            items: list,
        };
    }

    public async getNewsByCategory(category: string, count: number = 15) {
        let url = `${rootUrl}/category/${encodeURIComponent(category)}`;
        
        let crawler = {
            selector: 'article.container div.news-list ul li',
            callback: ($, i) => this.getTTVNews($, i)
        };
        let list = await this.getNewsList({
            url,
            options: crawlerHeaders,
            count,
            crawlers: [ crawler ]
        });
        
        return {
            title: `${title} ${category}`,
            link: url,
            items: list,
        };
    }

    public async getNewsByTag(tag: string, count: number = 15) {
        let url = `${rootUrl}/tag/${encodeURIComponent(tag)}`;
        
        let crawler = {
            selector: 'article.container div.news-list ul li',
            callback: ($, i) => this.getTTVNews($, i)
        };
        let list = await this.getNewsList({
            url,
            options: crawlerHeaders,
            count,
            crawlers: [ crawler ]
        });
        
        return {
            title: `${title} ${tag}`,
            link: url,
            items: list,
        };
    }

    private getTTVNews(content: cheerio.CheerioAPI, item: cheerio.Element) {
        let title = content(item).find('a div.title').text();
        let link = content(item).find('a').attr('href');
        let image = content(item).find('a img').attr('src');
        let description = content(item).find('div.summary').text();
        let pubDate = content(item).find('div.time').text();

        return {
            title,
            description,
            link,
            image,
            date: new Date(pubDate)
        };
    }
}
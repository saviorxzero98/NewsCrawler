import * as cheerio from 'cheerio';
import * as moment from 'moment';

import { ServiceContext } from '../../service';
import { NewsCrawler } from '../newsCrawler';
import * as utils from '../../feeds/utils';

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

        let list = await this.getNewsList({
            url,
            options: utils.crawlerOptions,
            selector: 'article.container div.news-list ul li',
            count,
            callback: ($, i) => this.getTTVNews($, i)
        });

        return {
            title: `${title}`,
            link: url,
            items: list,
        };
    }

    public async getNewsByCategory(category: string, count: number = 10) {
        let url = `${rootUrl}/category/${encodeURIComponent(category)}`;
        
        let list = await this.getNewsList({
            url,
            options: utils.crawlerOptions,
            selector: 'article.container div.news-list ul li',
            count,
            callback: ($, i) => this.getTTVNews($, i)
        });
        
        return {
            title: `${title} ${category}`,
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
            date: moment(pubDate, 'YYYY.MM.DD HH:mm').toDate(),
        };
    }
}
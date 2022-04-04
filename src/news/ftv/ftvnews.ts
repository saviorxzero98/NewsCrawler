import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

import { ServiceContext } from '../../service';
import * as utils from '../../feeds/utils';

const httpClient = axios.default;

const rootUrl = 'https://www.ftvnews.com.tw';
const title = '民視新聞';

const categoryMap = {
    realtime: '最新',
    popular: '熱門'
}

export class FTVNewsCrawler {
    private services: ServiceContext;
    constructor(services: ServiceContext) {
        this.services = services;
    }

    public async getNews(tag: string = 'realtime', count: number = 15) {
        if (tag !== 'realtime' && tag !== 'popular') {
            return this.getNewsByTag(tag, count);
        }
        let url = `${rootUrl}/${tag}`;
        console.log(`GET ${url}`);

        let response = await httpClient.get(url, utils.crawlerOptions);
        let $ = cheerio.load(response.data);
        let list = $('div.news-block')
            .slice(0, count)
            .map((_, item) => {
                let title = $(item).find('div.news-block div.content a h2').text();
                let link = rootUrl + $(item).find('div.content a').attr('href');
                let image = $(item).find('a.img-block img').attr('src');
                let description = $(item).find('div.content div.desc').text();
                let pubDate = $(item).find('div.time').text();

                return {
                    title,
                    link,
                    image,
                    description,
                    date: moment(pubDate, 'YYYY/MM/DD HH:mm:ss').toDate()
                };
            })
            .get();

        return {
            title: `${title} ${categoryMap[tag]}`,
            link: url,
            items: list,
        };
    }

    public async getNewsByTag(tag: string, count: number = 15) {
        let url = `${rootUrl}/tag/${encodeURIComponent(tag)}`;
        console.log(`GET ${url}`);
        
        let response = await httpClient.get(url, utils.crawlerOptions);
        let $ = cheerio.load(response.data);
        let list = $('section.news-list ul li')
            .slice(0, count)
            .map((_, item) => {
                let title = $(item).find('a div.content h2').text();
                let link = rootUrl + $(item).find('a').attr('href');
                let image = $(item).find('div.img-block img').attr('src');
                let pubDate = $(item).find('a div.content div.time').text();

                return {
                    title,
                    link,
                    image,
                    description: '',
                    date: moment(pubDate, 'YYYY/MM/DD HH:mm:ss').toDate()
                };
            })
            .get();

        return {
            title: `${title} ${tag}`,
            link: url,
            items: list,
        };
    }
}
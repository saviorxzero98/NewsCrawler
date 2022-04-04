import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

import { ServiceContext } from '../../app';
import * as utils from '../../feeds/utils';

const httpClient = axios.default;

const rootUrl = 'https://www.worldjournal.com';
const title = '世界新聞網';

const categoryMap = {
    '0': '即時',
    '121005': '焦點',
    '121006': '美國',
    '121093': '紐約',
    '121094': '洛杉磯',
    '121095': '舊金山',
    '121096': '地方',
    '121010': '中國',
    '121098': '台灣',
    '121099': '國際',
    '121102': '生活',
    '121103': '財經',
    '121007': '娛樂',
    '121008': '運動'
}

export class WorldJournalNewsCrawler {
    private services: ServiceContext;
    constructor(services: ServiceContext) {
        this.services = services;
    }
    
    public async getNews(category: string = '0', language: string = 'zh-tw', count: number = 15) {
        let url = `${rootUrl}/wj/cate/breaking/${category}`;
        category = (categoryMap[category]) ? category: '0';
        if (language === 'zh-cn') {
            url = `${url}?zh-cn`;
        }
        console.log(`GET ${url}`);
    
        let response = await httpClient.get(url, utils.crawlerOptions);
        let $ = cheerio.load(response.data);

        let list = $('div#breaknews div.subcate-list__link')
            .slice(0, count)
            .map((_, item) => {
                let title = $(item).find('h3.subcate-list__link__title').text();
                let link = $(item).find('a').attr('href');
                let image = $(item).find('img').attr('data-src');
                let description = $(item).find('p.subcate-list__link__content').text();
                let pubDate = $(item).find('span.subcate-list__time--roc').text();
                
                return {
                    title,
                    link,
                    description,
                    image,
                    date: moment(pubDate, 'YYYY-MM-DD HH:mm').toDate(),
                };
            })
            .get();
            
        return {
            title: `${title} ${categoryMap[category]}`,
            link: url,
            items: list,
        };
    }
}
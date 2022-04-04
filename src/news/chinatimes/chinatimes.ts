import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

import { ServiceContext } from '../../service';
import * as utils from '../../feeds/utils';

const httpClient = axios.default;

const rootUrl = 'https://www.chinatimes.com';
const title = '中時電子報';

const categoryMap = {
    realtimenews: '即時',
    politic: '政治',
    opinion: '言論',
    life: '生活',
    star: '娛樂',
    money: '財經',
    world: '國際',
    chinese: '兩岸',
    society: '社會',
    armament: '軍事',
    technologynews: '科技',
    sports: '體育',
    hottopic: '網推',
    tube: '有影',
    health: '健康',
    fortune: '運勢',
    taiwan: '寶島'
};

export class ChinaTimesNewsCrawler {
    private services: ServiceContext;
    constructor(services: ServiceContext) {
        this.services = services;
    }
    
    public async getNews(category: string = 'realtimenews', count: number = 15) {
        let url = `${rootUrl}/${category}/?chdtv`;
        console.log(`GET ${url}`);

        let response = await httpClient.get(url, utils.crawlerOptions);
        let $ = cheerio.load(response.data);
        let list = $('section.article-list ul div.row')
            .slice(0, count)
            .map((_, item) => {
                let title = $(item).find('h3.title a').text();
                let link = rootUrl + $(item).find('h3.title a').attr('href');
                let description = $(item).find('p.intro').text();
                let image = $(item).find('img.photo').attr('src');
                let pubDate = $(item).find('time').attr('datetime');

                return {
                    title,
                    link,
                    description,
                    image,
                    date: moment(pubDate, 'HH:mm YYYY/MM/DD').toDate(),
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
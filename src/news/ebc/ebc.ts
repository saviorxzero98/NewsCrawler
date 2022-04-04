import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

import { ServiceContext } from '../../app';
import * as utils from '../../feeds/utils';


const httpClient = axios.default;

const rootUrl = 'https://news.ebc.net.tw';
const title = '東森新聞';

const categoryMap = {
    realtime: '即時',
    hot: '熱門',
    society: '社會',
    politics: '政治',
    business: '財經',
    car: '汽車',
    star: 'E娛樂',
    world: '國際',
    astrology: '星座',
    comment: 'EBC森談',
    fun: '新奇',
    china: '兩岸',
    house: '房產',
    health: '健康',
    story: '暖聞',
    living: '生活',
    sport: '體育',
    travel: '旅遊'
}

export class EBCNewsCrawler {
    private services: ServiceContext;
    constructor(services: ServiceContext) {
        this.services = services;
    }

    public async getNews(category: string = 'realtime', count: number = 15) {
        let url = '';
        if (category === 'realtime' || category === 'hot') {
            url = `${rootUrl}/${category}`;
        }
        else {
            url = `${rootUrl}/news/${category}`;
        }
        console.log(`GET ${url}`);

        let response = await httpClient.get(url, utils.crawlerOptions);
        let $ = cheerio.load(response.data);
        let list = $('div.news-list-box div.white-box')
            .map((_, item) => {
                let title = $(item).find('div.text span.title').text();
                let link = rootUrl + $(item).find('a').attr('href');
                let image = $(item).find('div.pic div.target-img img').attr('src');
                let description = $(item).find('div.text span.summary').text();
                let pubDate = $(item).find('div.text span.small-gray-text').text();
                
                return {
                    title,
                    link,
                    image,
                    description: description,
                    date: moment(pubDate, 'MM/DD HH:mm').toDate()
                };
            })
            .get()
            .filter(i => i.title && i.link)
            .slice(0, count);
            
        return {
            title: `${title} ${categoryMap[category]}`,
            link: url,
            items: list,
        };
    }
}
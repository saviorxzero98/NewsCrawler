import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

import { ServiceContext } from '../../services/service';
import * as utils from '../../feeds/utils';
import { NewsCrawler } from '../newsCrawler';

const httpClient = axios.default;

const rootUrl = 'https://newtalk.tw';
const title = '新頭殼 Newtalk';

const categoryMap = {
    '1': '國際',
    '2': '政治',
    '3': '財經',
    '4': '司法',
    '5': '生活',
    '6': '創夢',
    '7': '中國',
    '8': '科技',
    '9': '環保',
    '10': '電競',
    '11': '藝文',
    '13': '選舉',
    '14': '社會',
    '15': '旅遊',
    '16': '美食',
    '17': '遊戲',
    '18': '娛樂',
    '19': '專欄',
    '101': '中央社',
    '102': '體育',
    '103': '新奇',
    '106': '網紅',
    'topics': '議題'
}

export class NewtalkNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }
    
    public async getNews(category: string = '', topic: string = '', count: number = 15) {
        let url = `${rootUrl}/news/summary/today`;
        let categoryName = '總覽';
        if (category) {
            if (category === 'topics' &&
                topic &&
                /^\d+$/.test(topic)) {
                categoryName = categoryMap['topics'];
                url = `${rootUrl}/news/topics/view/${topic}`;
            }
            else if (/^\d+$/.test(category) &&
                    categoryMap[category]) {
                categoryName = categoryMap['category'];
                url = `${rootUrl}/news/subcategory/${category}`;
            }
        }
        
        let crawlers = [
            this.getTopNewsCrawler(),
            this.getNextNewsCrawler()
        ]
        let list = await this.getNewsList({
            url,
            options: utils.crawlerOptions,
            count,
            crawlers: crawlers
        });

        let items = await this.getNewsDetials({
            list,
            options: utils.crawlerOptions,
            callback: (item, content) => {
                let description = content('meta[property="og:description"]').attr('content');
                let image = content('meta[property="og:image"]').attr('content');
                let pubDate = content('meta[property="article:published_time"]').attr('content');
                item.description = description;
                item.image = image;
                item.date = moment(pubDate, 'YYYY-MM-DDTHH:mm:ss').toDate();

                //let description = content('div.news-content').html();
                //let pubDate = content('div.content_date').text();
                //pubDate = pubDate.replace('發布', '')
                //                 .replace('|', '')
                //                 .trim();
                //pubDate = moment(pubDate, 'YYYY.MM.DD HH:mm').toDate();

                return item;
            }
        });
            
        return {
            title: `${title} ${categoryName}`,
            link: url,
            items: items
        };
    }


    private getTopNewsCrawler() {
        let crawler = {
            selector: 'div.news-top2 div.newsArea',
            callback: ($, i) => {
                let title = $(i).find('div.news-title a').text();
                let link = $(i).find('a').attr('href');
                //let image = $(i).find('div.news-img img').attr('src');

                return {
                    title,
                    link,
                    image: '',
                    description: '',
                    date: new Date(),
                };
            }
        };
        return crawler;
    }

    private getNextNewsCrawler() {
        let crawler = {
            selector: 'div.news-list div.news-list-item',
            callback: ($, i) => {
                let title = $(i).find('div.news_title').text();
                title = title.replace('\n', '').trim();
                let link = $(i).find('a').attr('href');
                //let image = $(i).find('div.news_img img').attr('src');
                //let description = $(i).find('div.news_text a').text();
                //let pubDate = $(i).find('div.news_date').text();
                //pubDate = pubDate.replace('發布', '')
                //                 .replace('|', '')
                //                 .trim();
                //pubDate = moment(pubDate, 'yyyy.MM.DD HH:mm').format('yyyy-MM-DD HH:mm');

                return {
                    title,
                    link,
                    image: '',
                    description: '',
                    date: new Date(),
                };
            }
        };
        return crawler;
    }
}
import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

import { ServiceContext } from '../../services/service';
import * as utils from '../../feeds/utils';
import { NewsCrawler } from '../newsCrawler';

const httpClient = axios.default;

const rootUrl = 'https://www.nownews.com';
const title = 'Nownews今日新聞';

const categoryMap = {
    'breaking': '即時',
    'news-summary': '要聞',
    'st': '專題',
    'entertainment': '娛樂',
    'sport': '運動',
    'news-global': '全球',
    'finance': '財經',
    'house2': '房產',
    'life': '生活',
    'novelty': '新奇',
    'clips': '影音',
    'show': '節目',
    'local': '地方',
    'health-life': '健康',
    'gama': '校園'
}

export class NownewsNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = 'breaking', subCategory: string = '', count: number = 15) {
        let url = `${rootUrl}/cat/${category}`;
        if (subCategory) {
            url = `${url}/${subCategory}`;
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
                item.date = moment(pubDate, 'YYYY-MM-DDTHH:mm').toDate()

                //let date = content('div.titleBlk p.time a').text();
                //let description = content('article').html();

                return item;
            }
        });
    
        return {
            title: `${title} ${categoryMap[category]}`,
            link: url,
            items: items
        };
    }

    private getTopNewsCrawler() {
        let crawler = {
            selector: 'div.sliderBlk div.swiper-slide',
            callback: ($, i) => {
                let title = $(i).find('a.trace-click img').attr('alt');
                let link = $(i).find('a.trace-click').attr('href');
                //let image = $(i).find('a.trace-click img').attr('src');

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
            selector: 'div.listBlk ul li',
            callback: ($, i) => {
                let title = $(i).find('div.txt h2').text() ??
                            $(i).find('div.txt h3').text();
                let link = $(i).find('a').attr('href');
                //let image = $(i).find('img.resize').attr('src');
                //let pubDate = $(i).find('div.txt p.time').text();

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
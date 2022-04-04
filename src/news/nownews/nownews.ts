import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

import { ServiceContext } from '../../app';
import * as utils from '../../feeds/utils';

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

export class NownewsNewsCrawler {
    private services: ServiceContext;
    constructor(services: ServiceContext) {
        this.services = services;
    }

    public async getNews(category: string = 'breaking', subCategory: string = '', count: number = 15) {
        let url = `${rootUrl}/cat/${category}`;
        if (subCategory) {
            url = `${url}/${subCategory}`;
        }
        console.log(`GET ${url}`);

        let response = await httpClient.get(url, utils.crawlerOptions);
        let content = cheerio.load(response.data);

        let topNewsList = await this.getTop5News(content);

        let list = topNewsList;
        if (count > 5) {
            let nextNewsList = await this.getNextNews(content, count - 5);
            list.push(...nextNewsList);
        }
    
        return {
            title: `${title} ${categoryMap[category]}`,
            link: url,
            items: list
        };
    }

    private async getTop5News(content: cheerio.CheerioAPI, count: number = 5) {
        let list = content('div.sliderBlk div.swiper-slide')
            .slice(0, count)
            .map((_, item) => {
                let title = content(item).find('a.trace-click img').attr('alt');
                let link = content(item).find('a.trace-click').attr('href');
                //let image = content(item).find('a.trace-click img').attr('src');

                return {
                    title,
                    link,
                    image: '',
                    description: '',
                    date: new Date(),
                };
            })
            .get();

        let items = await Promise.all(
            list.map(async (item) => 
                this.services
                    .cache
                    .tryGet(item.link, async () => {
                        let detailResponse = await httpClient.get(item.link, utils.crawlerOptions);
                        let content = cheerio.load(detailResponse.data);
                        let description = content('meta[property="og:description"]').attr('content');
                        let image = content('meta[property="og:image"]').attr('content');
                        let pubDate = content('meta[property="article:published_time"]').attr('content');
                        item.description = description;
                        item.image = image;
                        item.date = moment(pubDate, 'YYYY-MM-DDTHH:mm').toDate()

                        //let date = content('div.titleBlk p.time a').text();
                        //let description = content('article').html();

                        return item;
                    })
            )
        );

        return items;
    }
    private async getNextNews(content: cheerio.CheerioAPI, count: number = 10) {
        let list = content('div.listBlk ul li')
            .slice(0, count)
            .map((_, item) => {
                let title = content(item).find('div.txt h2').text() ||
                            content(item).find('div.txt h3').text();
                let link = content(item).find('a').attr('href');
                //let image = content(item).find('img.resize').attr('src');
                //let pubDate = content(item).find('div.txt p.time').text();

                return {
                    title,
                    link,
                    image: '',
                    description: '',
                    date: new Date(),
                };
            })
            .get();
    
        let items = await Promise.all(
            list.map(async (item) => 
                this.services
                    .cache
                    .tryGet(item.link, async () => {
                        let detailResponse = await httpClient.get(item.link);
                        let content = cheerio.load(detailResponse.data);
                        let description = content('meta[property="og:description"]').attr('content');
                        let image = content('meta[property="og:image"]').attr('content');
                        let pubDate = content('meta[property="article:published_time"]').attr('content');
                        item.description = description;
                        item.image = image;
                        item.date = moment(pubDate, 'YYYY-MM-DDTHH:mm').toDate()

                        //let description = content('article').html();
                        //item.description = description;

                        return item;
                    })
            )
        );

        return items;
    }
}
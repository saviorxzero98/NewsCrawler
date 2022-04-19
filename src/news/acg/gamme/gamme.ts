import * as moment from 'moment';

import { crawlerHeaders } from '../../../services/httpclient';
import { NewsCrawler } from '../../newsCrawler';
import { ServiceContext } from '../../../services/service';

const newsRootUrl = 'https://news.gamme.com.tw';
const sexyNewsRootUrl = 'https://sexynews.gamme.com.tw';
const newsTitle = '宅宅新聞 卡卡洛普';
const sexyNewsTitle = '西斯新聞 卡卡洛普';

const newsCategoryMap = {
    'all': '最新',
    'hotchick': '正妹',
    'anime': '動漫',
    'movies': '電影',
    'fresh': '新奇',
    'pets': '寵物',
    'hotguy': '型男',
    'kuso': 'Kuso',
    'myst': '詭異',
    'entertainment': '娛樂',
    '3c': '科技',
    'tasty': '美食',
    'gaming': '遊戲',
    'toy': '玩具',
    'design': '設計',
    'trend': '潮流',
    'car': '汽車',
    'feature': '精華'
}


export class GammeNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = '', count: number = 15) {
        let url = newsRootUrl;
        let categoryName = '';

        if (category) {
            url = `${url}/category/${category}`;
            category = this.tryGetMapKey(newsCategoryMap, category) || category;
            categoryName = newsCategoryMap[category] ?? '';
        }
        url = `${url}/feed`;

        let { list } = await this.getNewsListFromRSS({
            url,
            count
        });

        let items = await this.getNewsDetials({
            list,
            headers: crawlerHeaders,
            callback: (item, content, newsMeta) => {
                item.description = newsMeta.description;
                item.image = newsMeta.image;
                return item;
            }
        });

        return {
            title: `${newsTitle} ${categoryName}`,
            link: newsRootUrl,
            items: items
        };  
    }

    public async getNewsByTag(tag: string = '', count: number = 15) {
        let url = `${newsRootUrl}/tag/${encodeURIComponent(tag)}`;

        let items = await this.getNewsItems(url, count);
                  
        return {
            title: `${newsTitle} ${tag}`,
            link: url,
            items: items
        };
    }

    public async getSexNews(category: string = 'all', count: number = 15) {
        let url = `${sexyNewsRootUrl}/category/${category}`;
        let categoryName = newsCategoryMap[category] ?? '';
        
        let items = await this.getNewsItems(url, count);
                  
        return {
            title: `${sexyNewsTitle} ${categoryName}`,
            link: url,
            items: items
        };
    }

    public async getSexNewsByTag(tag: string = '', count: number = 15) {
        let url = `${sexyNewsRootUrl}/tag/${encodeURIComponent(tag)}`;

        let items = await this.getNewsItems(url, count);
                  
        return {
            title: `${sexyNewsTitle} ${tag}`,
            link: url,
            items: items
        };
    }

    private async getNewsItems(url: string, count: number = 15) {

        let crawlers = [
            {
                selector: 'div#category_new ul li',
                callback: ($, i) => {
                    let title = $(i).find('h3').text();
                    let link = $(i).find('a').attr('href');
                    let image = $(i).find('img').attr('src');
                    let description = $(i).find('p').text();

                    return {
                        title,
                        link,
                        image,
                        description,
                        date: new Date()
                    };
                }
            },
            {
                selector: 'div.Category-List6 div.List-4',
                callback: ($, i) => {
                    let title = $(i).find('h3 a').text();
                    let link = $(i).find('a').attr('href');
                    let image = $(i).find('img').attr('src');
                    let description = $(i).find('p').text();
                    let pubDate = $(i).find('spab.List-4-metas').text();
    
                    return {
                        title,
                        link,
                        image,
                        description,
                        date: moment(pubDate, 'YYYY-MM-DD').toDate()
                    };
                }
            }
        ];
        let list = await this.getNewsList({
            url,
            options: crawlerHeaders,
            count,
            crawlers: crawlers
        });

        let items = await this.getNewsDetials({
            list,
            headers: crawlerHeaders,
            callback: (item, content, newsMeta) => {
                let pubDate = content('span.postDate').text();
                item.date = moment(pubDate, 'YYYY-MM-DD').toDate();
                return item;
            }
        });
                  
        return items;
    }
}


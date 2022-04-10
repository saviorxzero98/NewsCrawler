import * as moment from 'moment';

import { crawlerHeaders } from '../../services/httpclient';
import { ServiceContext } from '../../services/service';
import { NewsCrawler } from '../newsCrawler';

const rootUrl = 'https://www.ctwant.com';
const title = 'CTWANT';

export class CtwantNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = '最新', subCategory: string = '', count: number = 15) {
        if (category !== '最新') {
            return await this.getNewsByCategory(category, subCategory, count);
        }
        
        return await this.getRealtimeNews(count);
    }

    private async getRealtimeNews(count: number = 15) {
        let url = `${rootUrl}/category/${encodeURIComponent('最新')}`;

        let crawler = {
            selector: 'div.p-realtime__list div.p-realtime__item',
            callback: ($, i) => {
                let title = $(i).find('div.p-realtime__item-content h3').text().trim();
                let link = rootUrl + $(i).find('a').attr('href');
                let pubDate = $(i).find('span.e-time').text().trim();

                return {
                    title,
                    link,
                    description: '',
                    image: '',
                    date: moment(pubDate, 'YYYY-MM-DD HH:mm').toDate(),
                };
            }
        };
        let list = await this.getNewsList({
            url,
            options: crawlerHeaders,
            count,
            crawlers: [ crawler ]
        });

        let items = await this.getNewsDetials({
            list,
            options: crawlerHeaders,
            callback: (item, content) => {
                let description = content('meta[property="og:description"]').attr('content');
                let image = content('meta[property="og:image"]').attr('content');
                let categoryName = content('div.e-category__main').text().trim();
                item.title = `[${categoryName}] ${item.title}`;
                item.description = description;
                item.image = image;
                return item;
            }
        });
     
        return {
            title: `${title} 最新`,
            link: url,
            items: items,
        };
    }

    private async getNewsByCategory(category: string, subCategory: string = '', count: number = 15) {
        let url = `${rootUrl}/category/${encodeURIComponent(category)}`;

        if (subCategory) {
            url = `${url}/${encodeURIComponent(subCategory)}`;
        }

        let crawlers = [
            {
                selector: 'a.p-category__hot-main, a.m-card-s--hot',
                callback: ($, i) => {
                    let title = $(i).find('h2').text() || $(i).find('h4').text();
                    let link = rootUrl + $(i).attr('href');
                    let pubDate = $(i).find('p.e-time img').text().trim();
                    
                    return {
                        title,
                        link,
                        description: '',
                        image: '',
                        date: moment(pubDate, 'YYYY-MM-DD HH:mm').toDate(),
                    };
                }
            },
            {
                selector: 'div.m-realtime div.row a',
                callback: ($, i) => {
                    let title = $(i).find('p.m-realtime__content').text();
                    let link = rootUrl + $(i).attr('href');
                    let pubDate = $(i).find('p.e-time img').text().trim();
                    
                    return {
                        title,
                        link,
                        description: '',
                        image: '',
                        date: moment(pubDate, 'YYYY-MM-DD HH:mm').toDate(),
                    };
                }
            },
            {
                selector: 'div.l-section__content a.m-card',
                callback: ($, i) => {
                    let title = $(i).find('h3').text();
                    let link = rootUrl + $(i).attr('href');
                    let pubDate = $(i).find('p.e-time img').text().trim();
                    
                    return {
                        title,
                        link,
                        description: '',
                        image: '',
                        date: moment(pubDate, 'YYYY-MM-DD HH:mm').toDate(),
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
            options: crawlerHeaders,
            callback: (item, content) => {
                let description = content('meta[property="og:description"]').attr('content');
                let image = content('meta[property="og:image"]').attr('content');
                item.description = description;
                item.image = image;
                return item;
            }
        });
     
        return {
            title: `${title} ${subCategory || category}`,
            link: url,
            items: items,
        };
    }
}
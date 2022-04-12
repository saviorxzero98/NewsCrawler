import * as moment from 'moment';

import { crawlerHeaders } from '../../services/httpclient';
import { NewsCrawler } from '../newsCrawler';
import { ServiceContext } from '../../services/service';

const rootUrl = 'https://news.ltn.com.tw';
const title = '自由時報';

const rssMap = {
    'all': '最新',
    'politics': '政治',
    'society': '社會',
    'life': '生活',
    'world': '國際',
    'local': '地方',
    'novelty': '蒐奇',
    'business': '財經',
    'entertainment': '娛樂',
    'sports': '體育',
    'opinion': '評論'
};

export class LTNNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(rss: string = 'all', count: number = 15) {
        if (rssMap[rss]) {
            let url = `${rootUrl}/rss/${rss}.xml`;

            let { list } = await this.getNewsListFromRSS({
                url,
                count
            });

            let items = await this.getNewsDetials({
                list,
                headers: crawlerHeaders,
                callback: (item, content, newsMeta) => {
                    item.description = newsMeta.description;
                    item.image = newsMeta.image ?? item.image;
                    item.date = newsMeta.pubDate;
                    return item;
                }
            });
             
            return {
                title: `${title} ${rssMap[rss]}`,
                link: url,
                items: items
            };
        }
        else if (rss === 'health') {
            return await this.getHealthNews(count);
        }

        return {
            title: `${title}`,
            link: rootUrl,
            items: []
        };
    }

    public async getHealthNews(count: number = 15) {
        let url = 'https://health.ltn.com.tw/breakingNewslist';

        let crawler = {
            selector: 'div.whitecon ul.list li',
            callback: ($, i) => {
                let title = $(i).find('h3.tit').text().trim();
                let link = $(i).find('a').attr('href');
                return {
                    title,
                    link,
                    image: '',
                    description: '',
                    date: new Date()
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
            headers: crawlerHeaders,
            callback: (item, content, newsMeta) => {
                item.description = newsMeta.description;
                item.image = newsMeta.image ?? item.image;
                item.date = newsMeta.pubDate;
                return item;
            }
        });
         
        return {
            title: `${title} 健康網`,
            link: url,
            items: items
        };
    }
}
import * as moment from 'moment';

import { NewsCrawler } from '../newsCrawler';
import { ServiceContext } from '../../service';
import * as utils from '../../feeds/utils';

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

            let list = await this.getRSSNewsList({
                url,
                count
            });

            let items = await this.getNewsDetials({
                list,
                options: utils.crawlerOptions,
                callback: (item, content) => {
                    let description = content('meta[property="og:description"]').attr('content');
                    let image = content('meta[property="og:image"]').attr('content');
                    let pubDate = content('meta[property="pubdate"]').attr('content');
                    item.description = description;
                    item.image = image;
                    item.date = moment(pubDate, 'YYYY-MM-DDTHH:mm:ss').toDate()
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

        let list = await this.getNewsList({
            url,
            options: utils.crawlerOptions,
            selector: 'div.whitecon ul.list li',
            count,
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
        });

        let items = await this.getNewsDetials({
            list,
            options: utils.crawlerOptions,
            callback: (item, content) => {
                let description = content('meta[property="og:description"]').attr('content');
                let image = content('meta[property="og:image"]').attr('content');
                let pubDate = content('meta[property="pubdate"]').attr('content');
                item.description = description;
                item.image = image;
                item.date = moment(pubDate, 'YYYY-MM-DDTHH:mm:ss').toDate()
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
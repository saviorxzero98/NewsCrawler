import * as moment from 'moment';

import { ServiceContext } from '../../service';
import { NewsCrawler } from '../newsCrawler';
import * as utils from '../../feeds/utils';

const rootUrl = 'https://www.ctwant.com';
const title = 'CTWANT';

export class CtwantNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = '最新', subCategory: string = '', count: number = 15) {
        return await this.getRealtimeNews(count);
    }

    private async getRealtimeNews(count: number = 15) {
        let url = `${rootUrl}/category/${encodeURIComponent('最新')}`;

        let list = await this.getNewsList({
            url,
            options: utils.crawlerOptions,
            selector: 'div.p-realtime__list div.p-realtime__item',
            count,
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
        });

        let items = await this.getNewsDetials({
            list,
            options: utils.crawlerOptions,
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
}
import * as moment from 'moment';

import { crawlerHeaders } from '../../services/httpclient';
import { ServiceContext } from '../../services/service';
import { NewsCrawler } from '../newsCrawler';

const rootUrl = 'https://health.gvm.com.tw';
const title = '健康遠見';

export class HealthGVMNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(count: number = 15) {
        let url = `${rootUrl}/newest`;
        return await this.getNewsItems(url, count);
    }


    public async getNewsByCategory(category: string = 'newest', count: number = 15) {
        if (category) {
            let url = `${rootUrl}/category/${category}`;
            return await this.getNewsItems(url, count);
        }
        return await this.getNews(count);
    }

    public async getNewsByTag(tag: string = '', count: number = 15) {
        if (tag) {
            let url = `${rootUrl}/tags/${encodeURIComponent(tag)}`;
            return await this.getNewsItems(url, count);
        }
        return await this.getNews(count);
    }

    public async getNewsItems(url: string, count: number = 15) {
        let name = ''

        let crawler = {
            selector: 'div.works-grid div.work-item',
            callback: ($, i) => {
                let title = $(i).find('div.Articlelist_title').text();
                let description = $(i).find('div.top3-text-no').text();
                let image = $(i).find('img').attr('src');
                let link = $(i).find('a').attr('href');
                let pubDate = $(i).find('div.date p').text()
                let date = moment(pubDate, 'YYYY-MM-DD').toDate();
                name = $('div.root-conts a').next().text();
                return {
                    title,
                    link,
                    image,
                    description,
                    date
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
                item.description = description;
                return item;
            }
        });

        return {
            title: `${title} ${name}`,
            link: url,
            items: items,
        };
    }
}
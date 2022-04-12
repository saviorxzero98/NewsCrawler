import * as moment from 'moment';

import { crawlerHeaders } from '../../../services/httpclient';
import { NewsCrawler } from '../../newsCrawler';
import { ServiceContext } from '../../../services/service';

const rootUrl = 'http://kenshin.hk';
const title = '劍心．回憶';

export class KenshinNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = '', subcategory: string = '', count: number = 15) {
        let url = rootUrl;
        let categoryName = '';
        if (category) {
            url = `${url}/category/${category}`;

            if (subcategory) {
                url = `${url}/${subcategory}`;
            }
        }

        let crawler = {
            selector: 'h2.entry-title a',
            callback: ($, i) => {
                let title = $(i).text();
                let link = $(i).attr('href');
                categoryName = $('h1.cat-title span').text();

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
            title: `${title} ${categoryName}`,
            link: url,
            items: items
        };
    }
}
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
            options: crawlerHeaders,
            callback: (item, content) => {
                let description = content('meta[property="og:description"]').attr('content');
                let image = content('meta[property="og:image"]').attr('content');
                let pubDate = content('meta[property="article:published_time"]').attr('content');
                item.description = description;
                item.image = image;
                item.date = moment(pubDate, 'YYYY-MM-DDTHH:mm:ss').toDate();
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
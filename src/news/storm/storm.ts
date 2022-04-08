import * as moment from 'moment';

import { ServiceContext } from '../../services/service';
import * as utils from '../../feeds/utils';
import { NewsCrawler } from '../newsCrawler';


const rootUrl = 'https://www.storm.mg';
const title = '風傳媒';

const categoryMap = {
    'articles': '新聞總覽',
    'all-comment': '評論總覽'
}


export class StormNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = 'articles', id: string = '', count: number = 15) {
        let url = '';

        if (/^\d+$/.test(category)) {
            url = `${rootUrl}/category/${category}`;
        }
        else {
            url = `${rootUrl}/${category}`;

            if (id) {
                url = `${url}/${id}`;
            }
        }

        let categoryName = '';
        let crawler = {
            selector: '.link_title',
            callback: ($, i) => {
                let title = $(i).text();
                let link = $(i).attr('href');
                categoryName = $('p#logo_text').text() || 
                               $('div#logo img').attr('alt') || 
                               categoryMap[category] || '';

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
            options: utils.crawlerOptions,
            count,
            crawlers: [ crawler ]
        });
 
        let items = await this.getNewsDetials({
            list,
            options: utils.crawlerOptions,
            callback: (item, content) => {
                let description = content('meta[property="og:description"]').attr('content');
                let image = content('meta[property="og:image"]').attr('content');
                let pubDate = content('meta[itemprop="datePublished"]').attr('content');
                item.description = description;
                item.image = image;
                item.date = moment(pubDate, 'YYYY-MM-DDTHH:mm:ss').toDate();
                return item;
            }
        });

        return {
            title: `${title} ${categoryName}`,
            link: url,
            items: items,
        };
    }
}
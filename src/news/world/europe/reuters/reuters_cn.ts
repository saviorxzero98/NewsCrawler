import * as moment from 'moment';

import { crawlerHeaders } from '../../../../services/httpclient';
import { ServiceContext } from '../../../../services/service';
import { NewsCrawler } from '../../../newsCrawler';

const rootUrl = 'https://cn.reuters.com';
const title = 'Reuters';

export class ReutersZhNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = '', count: number = 15)  {
        let url = `${rootUrl}/news`;
        if (category) {
            if (category === 'investing' || category === 'life') {
                url =  `${rootUrl}/${category}`;
            }
            else {
                url = `${url}/${category}`;
            }
        }
        
        let pageName = '';
        let crawler = {
            selector: '.inlineLinks a',
            callback: ($, i) => {
                let title = $(i).attr('href');
                let link = rootUrl + $(i).attr('href');
                pageName = $('h1.module-heading span.title-last').text();

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
                let title = content('meta[property="og:title"]').attr('content');
                let description = content('meta[property="og:description"]').attr('content');
                let image = content('meta[property="og:image"]').attr('content');
                let pubDate = content('meta[property="og:article:published_time"]').attr('content');
                item.title = title;
                item.description = description;
                item.image = image;
                item.date = moment(pubDate, 'YYYY-MM-DDTHH:mm').toDate();

                return item;
            }
        });

        return {
            title: `${title} ${pageName}`,
            link: url,
            items: items,
        };
    }
}
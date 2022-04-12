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
            headers: crawlerHeaders,
            callback: (item, content, newsMeta) => {
                item.title = newsMeta.title;
                item.description = newsMeta.description;
                item.image = newsMeta.image ?? item.image;

                let pubDate = content('meta[property="og:article:published_time"]').attr('content');
                item.date = new Date(pubDate);

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
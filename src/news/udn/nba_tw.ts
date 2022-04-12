import * as moment from 'moment';

import { crawlerHeaders } from '../../services/httpclient';
import { ServiceContext } from '../../services/service';
import { NewsCrawler } from '../newsCrawler';

const rootUrl = 'https://nba.udn.com';
const title = 'NBA 台灣';

const categoryMap = {
    newest: '最新',
    hottest: '熱門'
};

export class NBATaiwanNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }
    
    public async getNews(category: string = 'newest', count: number = 15) {
        let url = `${rootUrl}/nba/cate/6754/-1/${category}`;

        let crawler = {
            selector: 'div#news_list_body dt',
            callback: ($, i) => {
                let title = $(i).find('h3').text();
                let link = rootUrl + $(i).find('a').attr('href');
                //let image = $(i).find('img').attr('data-src');
                //let description = $(i).find('p').text();
                //let pubDate = $(i).find('b').text();

                return {
                    title,
                    link,
                    image: '',
                    description: '',
                    date: new Date(),
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
                item.image = newsMeta.image;

                let pubDate = content('meta[name="date.available"]').attr('content');
                item.date = new Date(pubDate);
                return item;
            }
        });

        return {
            title: `${title} ${categoryMap[category]}`,
            link: url,
            items: items,
        };
    }
}
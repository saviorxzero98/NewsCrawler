import * as moment from 'moment';

import { ServiceContext } from '../../services/service';
import * as utils from '../../feeds/utils';
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

        let list = await this.getNewsList({
            url,
            options: utils.crawlerOptions,
            selector: 'div#news_list_body dt',
            count,
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
        });

        let items = await this.getNewsDetials({
            list,
            options: utils.crawlerOptions,
            callback: (item, content) => {
                let description = content('meta[property="og:description"]').attr('content');
                let image = content('meta[property="og:image"]').attr('content');
                let pubDate = content('meta[name="date.available"]').attr('content');
                item.description = description;
                item.image = image;
                item.date = moment(pubDate, 'YYYY/MM/DD HH:mm:ss').toDate();
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
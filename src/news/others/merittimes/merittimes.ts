import * as moment from 'moment';

import { crawlerHeaders } from '../../../services/httpclient';
import { ServiceContext } from '../../../services/service';
import { NewsCrawler } from '../../newsCrawler';


const rootUrl = 'https://www.merit-times.com';
const title = '人間福報';

export class MeritTimesNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }
    
    public async getNews(classId: string = '7', count: number = 25) {
        let url = `${rootUrl}/PageList.aspx?classid=${classId}`;

        let crawler = {
            selector: 'section div.news',
            callback: ($, i) => {
                let title = $(i).find('div.newsTxt a.newsLink').text();
                let link =  rootUrl + '/' + $(i).find('div.newsTxt a.newsLink').attr('href');
                let description = $(i).find('div.newsTxt p').text();
                let pubDate = $(i).find('div.newsDate').text();

                return {
                    title,
                    link,
                    description,
                    image: '',
                    date: moment(pubDate, 'YYYY.MM.DD').toDate()
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
                item.image = newsMeta.image;
                return item;
            }
        });

        return {
            title: `${title}`,
            link: url,
            items: items,
        };
    }
}
import * as moment from 'moment';

import { crawlerHeaders } from '../../../../services/httpclient';
import { ServiceContext } from '../../../../services/service';
import { NewsCrawler } from '../../../newsCrawler';


const rootUrl = 'https://www.ntdtv.com.tw';
const title = '新唐人亞太電視台';

export class NTDTVTwNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = '要聞', count: number = 15) {
        let url = `${rootUrl}/news/${encodeURIComponent(category)}`;
        
        let crawlers = [
            this.getTopNewsCrawler(),
            this.getNextNewsCrawler()
        ];
        let list = await this.getNewsList({
            url,
            options: crawlerHeaders,
            count,
            crawlers: crawlers
        });
            
        return {
            title: `${title} ${category}`,
            link: url,
            items: list,
        };
    }

    private getTopNewsCrawler() {
        let crawler = {
            selector: 'div.Headlines_photo',
            callback: ($, i) => {
                let title = $(i).find('h3').text();
                let link = rootUrl + $(i).find('a').attr('href');
                let image = 'https:' + $(i).find('img').attr('data-src-small');
                let description = $(i).find('p').text();
                let pubDate = $(i).find('div.article_time').text();

                return {
                    title,
                    link,
                    image,
                    description,
                    date: moment(pubDate, 'YYYY-MM-DD HH:mm:ss').toDate()
                };
            }
        };
        return crawler;
    }

    private getNextNewsCrawler() {
        let crawler = {
            selector: 'div.pane_list ul li',
            callback: ($, i) => {
                let title = $(i).find('h3').text();
                let link = rootUrl + $(i).find('a').attr('href');
                let image = 'https:' + $(i).find('img').attr('data-src-small');
                let description = $(i).find('p').text();
                let pubDate = $(i).find('div.article_time').text();

                return {
                    title,
                    link,
                    image,
                    description,
                    date: moment(pubDate, 'YYYY-MM-DD HH:mm:ss').toDate()
                };
            }
        };
        return crawler;
    }
}
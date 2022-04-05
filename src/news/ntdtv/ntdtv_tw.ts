import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

import { ServiceContext } from '../../service';
import { NewsCrawler } from '../newsCrawler';
import * as utils from '../../feeds/utils';

const httpClient = axios.default;

const rootUrl = 'https://www.ntdtv.com.tw';
const title = '新唐人亞太電視台';

export class NTDTVTwNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = '要聞', count: number = 15) {
        let url = `${rootUrl}/news/${encodeURIComponent(category)}`;
        
        console.log(`GET ${url}`);
        
        let response = await httpClient.get(url, utils.crawlerOptions);
        let content = cheerio.load(response.data);

        let list = [];
        let topItem = this.getTopNews(content);
        list.push(topItem);
        if (count > 1) {
            let otherItems = this.getOtherNews(content, count - 1);
            list.push(...otherItems);
        }
            
        return {
            title: `${title} ${category}`,
            link: url,
            items: list,
        };
    }

    private getTopNews(content: cheerio.CheerioAPI) {
        let item = content('div.Headlines_photo');

        let title = item.find('h3').text();
        let link = rootUrl + item.find('a').attr('href');
        let image = 'https:' + item.find('img').attr('data-src-small');
        let description = item.find('p').text();
        let pubDate = item.find('div.article_time').text();

        return {
            title,
            link,
            image,
            description,
            date: moment(pubDate, 'YYYY-MM-DD HH:mm:ss').toDate()
        };
    }

    private getOtherNews(content: cheerio.CheerioAPI, count: number = 14) {
        let list = content('div.pane_list ul li')
            .map((_, item) => {
                let title = content(item).find('h3').text();
                let link = rootUrl + content(item).find('a').attr('href');
                let image = 'https:' + content(item).find('img').attr('data-src-small');
                let description = content(item).find('p').text();
                let pubDate = content(item).find('div.article_time').text();

                return {
                    title,
                    link,
                    image,
                    description,
                    date: moment(pubDate, 'YYYY-MM-DD HH:mm:ss').toDate()
                };
            })
            .get()
            .filter(n => n.title && n.link)
            .slice(0, count);
        return list;
    }
}
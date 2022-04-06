import * as moment from 'moment';

import { ServiceContext } from '../../services/service';
import * as utils from '../../feeds/utils';
import { NewsCrawler } from '../newsCrawler';


const rootUrl = 'https://www.ftvnews.com.tw';
const title = '民視新聞';

const categoryMap = {
    realtime: '最新',
    popular: '熱門'
}

export class FTVNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }
    public async getNews(tag: string = 'realtime', count: number = 15) {
        if (tag !== 'realtime' && tag !== 'popular') {
            return this.getNewsByTag(tag, count);
        }
        let url = `${rootUrl}/${tag}`;

        let list = await this.getNewsList({
            url,
            options: utils.crawlerOptions,
            selector: 'div.news-block',
            count,
            callback: ($, i) => {
                let title = $(i).find('div.news-block div.content a h2').text();
                let link = rootUrl + $(i).find('div.content a').attr('href');
                let image = $(i).find('a.img-block img').attr('src');
                let description = $(i).find('div.content div.desc').text();
                let pubDate = $(i).find('div.time').text();

                return {
                    title,
                    link,
                    image,
                    description,
                    date: moment(pubDate, 'YYYY/MM/DD HH:mm:ss').toDate()
                };
            }
        });

        return {
            title: `${title} ${categoryMap[tag]}`,
            link: url,
            items: list,
        };
    }

    public async getNewsByTag(tag: string, count: number = 15) {
        let url = `${rootUrl}/tag/${encodeURIComponent(tag)}`;

        let list = await this.getNewsList({
            url,
            options: utils.crawlerOptions,
            selector: 'section.news-list ul li',
            count,
            callback: ($, i) => {
                let title = $(i).find('a div.content h2').text();
                let link = rootUrl + $(i).find('a').attr('href');
                let image = $(i).find('div.img-block img').attr('src');
                let pubDate = $(i).find('a div.content div.time').text();

                return {
                    title,
                    link,
                    image,
                    description: '',
                    date: moment(pubDate, 'YYYY/MM/DD HH:mm:ss').toDate()
                };
            }
        });

        return {
            title: `${title} ${tag}`,
            link: url,
            items: list,
        };
    }
}
import * as moment from 'moment';

import { crawlerHeaders } from '../../services/httpclient';
import { ServiceContext } from '../../services/service';
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
        if (tag && tag.toLowerCase() !== 'realtime' && tag.toLowerCase() !== 'popular') {
            return this.getNewsByTag(tag, count);
        }

        let url = `${rootUrl}/realtime`;
        let tagName = categoryMap['realtime'];
        tag = this.tryGetMapKey(categoryMap, tag);
        if (tag) {
            url = `${rootUrl}/${tag}`;
            tagName = categoryMap[tag];
        }

        let crawler = {
            selector: 'div.news-block',
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
                    date: new Date(pubDate)
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
                return item;
            }
        });

        return {
            title: `${title} ${tagName}`,
            link: url,
            items: items,
        };
    }

    public async getNewsByTag(tag: string, count: number = 15) {
        let url = `${rootUrl}/tag/${encodeURIComponent(tag)}`;

        let crawler = {
            selector: 'section.news-list ul li',
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
                    date: new Date(pubDate)
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
                return item;
            }
        });

        return {
            title: `${title} ${tag}`,
            link: url,
            items: items,
        };
    }
}
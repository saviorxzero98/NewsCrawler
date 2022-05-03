import { crawlerHeaders } from '../../../services/httpclient';
import { ServiceContext } from '../../../services/service';
import { NewsCrawler } from '../../newsCrawler';


const rootUrl = 'https://www.cw.com.tw/';
const title = '天下雜誌';

export class CWNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getTodayNews(count: number = 15) {
        let url = `${rootUrl}/today`;

        let crawler = {
            selector: 'article section.subArticle',
            callback: ($, i) => {
                let title = $(i).find('h3 a').text();
                let description = $(i).find('div.caption p').text();
                let image = $(i).find('img').attr('src');
                let link = $(i).find('h3 a').attr('href');
                let pubDate = $(i).find('time').text();

                return {
                    title,
                    link,
                    image: image,
                    description: description,
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
            title: `${title}`,
            link: url,
            items: items,
        };
    }

    public async getNewsByChannel(channel: string = '', count: number = 15) {
        let url = '';
        let channelName = '';
        if (channel && /^\d+$/.test(channel)) {
            url = `${rootUrl}/masterChannel.action?idMasterChannel=${channel}`;
        }
        else {
            return await this.getTodayNews(count);
        }

        let crawler = {
            selector: 'article section.article',
            callback: ($, i) => {
                channelName = $('div.class-header h1').text();

                let title = $(i).find('h3 a').text();
                let description = $(i).find('div.caption p').text();
                let image = $(i).find('img').attr('src');
                let link = $(i).find('h3 a').attr('href');
                let pubDate = $(i).find('time').text();

                return {
                    title,
                    link,
                    image: image,
                    description: description,
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
            title: `${title} ${channelName}`,
            link: url,
            items: items,
        };
    }

    public async getNewsBySubChannel(channel: string = '', count: number = 15) {
        let url = '';
        let channelName = '';
        if (channel && /^\d+$/.test(channel)) {
            url = `${rootUrl}/subchannel.action?idSubChannel=${channel}`;
        }
        else {
            return await this.getTodayNews(count);
        }

        let crawler = {
            selector: 'article section.article',
            callback: ($, i) => {
                channelName = $('div.class-header h1').text();

                let title = $(i).find('h3 a').text();
                let description = $(i).find('div.caption p').text();
                let image = $(i).find('img').attr('src');
                let link = $(i).find('h3 a').attr('href');
                let pubDate = $(i).find('time').text();

                return {
                    title,
                    link,
                    image: image,
                    description: description,
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
            title: `${title} ${channelName}`,
            link: url,
            items: items,
        };
    }
}
import { NewsCrawler } from '../../newsCrawler';
import { ServiceContext } from '../../../services/service';
import * as utils from '../../../feeds/utils';

const rootUrl = 'https://news.qoo-app.com';
const title = 'QooApp';

export class QooAppNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = '', count: number = 15) {
        let url = rootUrl;
        if (category) {
            url = `${url}/category/news-zh/${encodeURIComponent(category)}/feed`;
        }
        url = `${url}/feed`;

        let items = await this.getDetialNews(url);

        return {
            title: `${title}`,
            link: rootUrl,
            items: items
        };  
    }

    public async getNewsByCategory(category: string = '', subCategory: string = '', 
                                   count: number = 15){
        let url = rootUrl;
        if (category) {
            url = `${url}/category/${encodeURIComponent(category)}`;

            if (subCategory) {
                url = `${url}/${encodeURIComponent(subCategory)}`;
            }
        }
        url = `${url}/feed`;

        let items = await this.getDetialNews(url, count);

        return {
            title: `${title}`,
            link: rootUrl,
            items: items
        };  
    }

    public async getNewsByTag(tag: string = '', count: number = 15) {
        let url = rootUrl;
        if (tag) {
            url = `${url}/tag/${encodeURIComponent(tag)}`;
        }
        url = `${url}/feed`;

        let items = await this.getDetialNews(url, count);

        return {
            title: `${title} ${tag}`,
            link: rootUrl,
            items: items
        };  
    }

    public async getNewsByTopic(topic: string = '', count: number = 15) {
        let url = rootUrl;
        if (topic) {
            url = `${url}/category/original/collections/qoo_topic/${encodeURIComponent(topic)}`;
        }
        url = `${url}/feed`;

        let items = await this.getDetialNews(url, count);

        return {
            title: `${title}`,
            link: rootUrl,
            items: items
        };  
    }

    private async getDetialNews(url: string, count: number = 15) {
        let list = await this.getRSSNewsList({
            url,
            count
        });

        let items = await this.getNewsDetials({
            list,
            options: utils.crawlerOptions,
            callback: (item, content) => {
                let description = content('meta[property="og:description"]').attr('content');
                let image = content('meta[property="og:image"]').attr('content');

                item.description = description;
                item.image = image;
                return item;
            }
        });

        return items;
    }
}
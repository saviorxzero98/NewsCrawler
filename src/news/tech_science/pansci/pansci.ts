import { crawlerHeaders } from '../../../services/httpclient';
import { ServiceContext } from '../../../services/service';
import { NewsCrawler } from '../../newsCrawler';


const rootUrl = 'https://pansci.asia';

export class PansciNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = '', count: number = 15) {      
        let url = `${rootUrl}`;
        if (category) {
            url = `${rootUrl}/archives/category/type/${encodeURIComponent(category)}`;
        }
        url = `${url}/feed`;

        let { list, title } = await this.getNewsListFromRSS({
            url,
            count
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
            link: rootUrl,
            items: items
        };
    }

    public async getNewsByTag(tag: string = '', count: number = 15) {      
        let url = `${rootUrl}`;
        if (tag) {
            url = `${rootUrl}/archives/tag/${encodeURIComponent(tag)}`;
        }
        url = `${url}/feed`;

        let { list, title } = await this.getNewsListFromRSS({
            url,
            count
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
            link: rootUrl,
            items: items
        };
    }
}
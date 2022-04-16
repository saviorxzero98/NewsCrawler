import { crawlerHeaders, HttpClient } from '../../../../services/httpclient';
import { ServiceContext } from '../../../../services/service';
import { NewsCrawler } from '../../../newsCrawler';

const rootUrl = 'https://www.hk01.com';
const apiRootUrl = 'https://web-data.api.hk01.com';
const title = '香港01';


export class HK01NewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(count: number = 15) {
        let url = `${apiRootUrl}/v2/page/hot/`;
        this.services.logger.logGetUrl(url);

        let httpClient = new HttpClient();
        let response = await httpClient.get(url, crawlerHeaders);
        let data = response.data;

        let items = await this.getNewsItems(data, data.items, count);

        return {
            title: `${title} 熱門`,
            link: rootUrl,
            items: items
        };
    }

    public async getNewsByZone(zone: string = '1', count: number = 15) {
        let url = `${apiRootUrl}/v2/page/zone/${zone}`;
        this.services.logger.logGetUrl(url);

        let httpClient = new HttpClient();
        let response = await httpClient.get(url, crawlerHeaders);
        let data = response.data;

        let items = await this.getNewsItems(data, data.sections[0].items, count);

        return {
            title: `${title} ${data.zone.publishName}`,
            link: rootUrl,
            items: items
        };
    }

    public async getNewsByCategory(category: string = '2', count: number = 15) {
        let url = `${apiRootUrl}/v2/page/category/${category}`;
        this.services.logger.logGetUrl(url);

        let httpClient = new HttpClient();
        let response = await httpClient.get(url, crawlerHeaders);
        let data = response.data;

        let items = await this.getNewsItems(data, data.sections[0].items, count);

        return {
            title: `${title} ${data.category.publishName}`,
            link: rootUrl,
            items: items
        };
    }

    public async getNewsByTag(tag: string = '', count: number = 15) {
        let url = `${apiRootUrl}/v2/page/tag/${tag}`;
        this.services.logger.logGetUrl(url);

        let httpClient = new HttpClient();
        let response = await httpClient.get(url, crawlerHeaders);
        let data = response.data;

        let items = await this.getNewsItems(data, data.articles, count);

        return {
            title: `${title} ${data.tag.tagName}`,
            link: rootUrl,
            items: items
        };
    }

    public async getNewsByIssue(tag: string = '', count: number = 15) {
        let url = `${apiRootUrl}/v2/page/issue/${tag}`;
        this.services.logger.logGetUrl(url);

        let httpClient = new HttpClient();
        let response = await httpClient.get(url, crawlerHeaders);
        let data = response.data;

        let items = await this.getNewsItems(data, data.issue.blocks[0].articles, count);

        return {
            title: `${title} ${data.tag.tagName}`,
            link: rootUrl,
            items: items
        };
    }

    private async getNewsItems(data: any, items: any[], count: number) {
        if (items === undefined || 
            !Array.isArray(items)) {
            return [];
        }

        let list = [];
        for (let item of items) {
            if (item.type === 1) {
                list.push({
                    title: item.data.title,
                    link: item.data.canonicalUrl,
                    image: item.data.mainImage.cdnUrl,
                    description: item.data.description,
                    date: new Date(item.data.lastModifyTime * 1000)
                })
            }
            else {
                list.push( {
                    title: item.data.title,
                    link: item.data.canonicalUrl,
                    image: '',
                    description: '',
                    date: new Date()
                });
            }
        }
        return list.slice(0, count);
    }

    private isVaildResponse(data: any) {
        return data && 
               data.sections && 
               Array.isArray(data.sections.length) &&
               data.sections.length > 0;
    }
}
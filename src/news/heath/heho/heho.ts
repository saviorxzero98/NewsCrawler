import { crawlerHeaders } from '../../../services/httpclient';
import { NewsCrawler } from '../../newsCrawler';
import { ServiceContext } from '../../../services/service';

const rootUrl = 'https://heho.com.tw';
const cancerRootUrl = 'https://cancer.heho.com.tw';

export class HehoNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = '', subcategory: string = '', count: number = 15) {
        let url = `${rootUrl}`;
        if (category) {
            url = `${rootUrl}/archives/category/${category}`;

            if (subcategory) {
                url = `${url}/${subcategory}`;
            }
        }
        url = `${url}/feed`;

        let { list, title } = await this.getNewsListFromRSS({
            url,
            count
        });

        return {
            title: `${title}`,
            link: url,
            items: list
        };
    }

    public async getCancerNews(category: string = '', subcategory: string = '', count: number = 15) {
        let url = `${cancerRootUrl}`;
        if (category) {
            url = `${cancerRootUrl}/archives/category/cancer_encyclopedia/${category}`;

            if (subcategory) {
                url = `${url}/${subcategory}`;
            }
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
                item.image = newsMeta.image ?? item.image;
                return item;
            }
        });

        return {
            title: `${title}`,
            link: url,
            items: items
        };
    }
}
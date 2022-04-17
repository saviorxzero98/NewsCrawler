import { crawlerHeaders } from '../../../services/httpclient';
import { ServiceContext } from '../../../services/service';
import { NewsCrawler } from '../../newsCrawler';


const rootUrl = 'https://technews.tw';
//const title = 'TechNews 科技新報';

export class TechNewsNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }
    
    public async getNews(category: string = '', subcategory: string = '', count: number = 15) {      
        let url = `${rootUrl}`;

        if (category) {
            url = `${url}/category/${encodeURIComponent(category)}`;

            if (subcategory) {
                url = `${url}/${encodeURIComponent(subcategory)}`;
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
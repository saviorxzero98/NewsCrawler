import { crawlerHeaders } from '../../../services/httpclient';
import { NewsCrawler } from '../../newsCrawler';
import { ServiceContext } from '../../../services/service';

const rootUrl = 'https://tnntoday.com';
//const title = '滔新聞';

export class TnnTodayNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(section: string = '', category: string = '',
                         subcategory: string = '', count: number = 15) {
        let url = rootUrl;
        
        if (section) {
            url = `${rootUrl}/category/${section}`;

            if (category) {
                url = `${url}/${category}`;

                if (subcategory) {
                    url = `${url}/${subcategory}`;
                }
            }
        }
        url = `${url}/feed`;

        let { list, title } = await this.getNewsListFromRSS({
            url,
            count
        });
            
        return {
            title: `${title}`,
            link: rootUrl,
            items: list
        };
    }
}
import { crawlerHeaders } from '../../../services/httpclient';
import { ServiceContext } from '../../../services/service';
import { NewsCrawler } from '../../newsCrawler';


const rootUrl = 'https://tomorrowsci.com';
const title = '明日科學';

const categoryMap = {
    'news': '',
    'science': '科學',
    'technology': '科技',
    'environment': '環境',
    'medicine': '醫學',
    'investment': '投資',
    'healthy': '健康',
    'master': '明日專欄'
}

export class TomorrowSciNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }
    
    public async getNews(category: string = 'news', count: number = 15) {      
        let url = `${rootUrl}/news`;
        let categoryName = '';

        if (category &&  categoryMap[category]) {
            url = `${rootUrl}/${category}`;
            categoryName = categoryMap[category];
        }
        url = `${url}/feed`;


        let { list } = await this.getNewsListFromRSS({
            url,
            count
        });
        
        let items = await this.getNewsDetials({
            list,
            headers: crawlerHeaders,
            callback: (item, content, newsMeta) => {
                item.description = newsMeta.description;
                if (item.description.indexOf('<img') === -1) {
                    item.image = newsMeta.image;
                }
                return item;
            }
        });

        return {
            title: `${title} ${categoryName}`,
            link: rootUrl,
            items: items
        };
    }
}
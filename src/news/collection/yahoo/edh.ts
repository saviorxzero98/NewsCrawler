import { crawlerHeaders } from '../../../services/httpclient';
import { NewsCrawler } from '../../newsCrawler';
import { ServiceContext } from '../../../services/service';

const rootUrl = 'https://www.edh.tw';
const rssRootUrl = 'https://www.edh.tw/upload/all_rss.xml';
const title = '早安健康'


export class YahooEDHNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(count: number = 15) {
        let url = rssRootUrl;
        
        let { list } = await this.getNewsListFromRSS({
            url,
            count
        });

        let items = await this.getNewsDetials({
            list,
            headers: crawlerHeaders,
            callback: (item, content, newsMeta) => {
                item.description = newsMeta.description;
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
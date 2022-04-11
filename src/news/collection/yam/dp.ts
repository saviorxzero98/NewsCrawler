
import { crawlerHeaders } from '../../../services/httpclient';
import { NewsCrawler } from '../../newsCrawler';
import { ServiceContext } from '../../../services/service';

const rootUrl = 'https://dq.yam.com/';
const rssRootUrl = 'https://dq-api.azurewebsites.net/f-system/get-rss';
const title = '地球圖輯隊';

export class YamDQNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(count: number = 15) {
        let url = rssRootUrl;
        let list = await this.getRSSNewsList({
            url,
            count
        });

        let items = await this.getNewsDetials({
            list,
            options: crawlerHeaders,
            callback: (item, content) => {
                let image = content('meta[property="og:image"]').attr('content');
                item.image = image;
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
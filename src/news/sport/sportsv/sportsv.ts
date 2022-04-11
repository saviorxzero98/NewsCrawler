
import { crawlerHeaders } from '../../../services/httpclient';
import { NewsCrawler } from '../../newsCrawler';
import { ServiceContext } from '../../../services/service';

const rootUrl = 'https://www.sportsv.net';
const title = '運動視界';

export class SportSVNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = '', subcategory: string = '',count: number = 15) {
        let url = `${rootUrl}`;

        if (category) {
            url = `${url}/${category}`;

            if (subcategory) {
                url = `${url}/${subcategory}`;
            }
        }
        url = `${url}/feed`;


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
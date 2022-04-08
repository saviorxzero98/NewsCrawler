import * as moment from 'moment';

import { NewsCrawler } from '../newsCrawler';
import { ServiceContext } from '../../services/service';
import * as utils from '../../feeds/utils';

const rootUrl = 'http://new.ctv.com.tw';
const title = '中視新聞';

export class CTVNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews( count: number = 15) {
        let url = `${rootUrl}/rss`;

        let list = await this.getRSSNewsList({
            url,
            count
        });

        /*let items = await this.getNewsDetials({
            list,
            options: utils.crawlerOptions,
            callback: (item, content) => {
                let description = content('meta[property="og:description"]').attr('content');
                let image = content('meta[property="og:image"]').attr('content');
                item.description = description;
                item.image = image;
                return item;
            }
        });*/

        return {
            title: `${title}`,
            link: url,
            items: list
        };
    }
}
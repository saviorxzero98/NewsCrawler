import * as moment from 'moment';

import { crawlerHeaders } from '../../services/httpclient';
import { NewsCrawler } from '../newsCrawler';
import { ServiceContext } from '../../services/service';

const rootUrl = 'http://new.ctv.com.tw';
const title = '中視新聞';

export class CTVNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews( count: number = 15) {
        let url = `${rootUrl}/rss`;

        let { list } = await this.getNewsListFromRSS({
            url,
            count,
            callback: (item) => {
                item.title = item.title.split('│')[0];
                item.content = item.summary;

                let link: string = item.id;
                link = link.replace(`${rootUrl}/Article`, '');
                link = encodeURIComponent(link);
                item.link = `${rootUrl}/Article/${link}`;
                
                return item;
            }
        })

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
            link: url,
            items: items
        };
    }
}
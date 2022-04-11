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

        let rssData = await this.getRSSNewsData(url);

        let list = [];
        for (let item of rssData.items) {
            let link: string = item.id;
            link = link.replace(`${rootUrl}/Article`, '');
            link = encodeURIComponent(link);
            
            let title = item.title.split('│')[0];

            list.push({
                title: title,
                link: `${rootUrl}/Article/${link}` ,
                description: item.summary,
                date: moment(item.isoDate, 'YYYY-MM-DDTHH:mm:ss').toDate()
            })
        }
        list = list.slice(0, count);

        let items = await this.getNewsDetials({
            list,
            options: crawlerHeaders,
            callback: (item, content) => {
                let description = content('meta[property="og:description"]').attr('content');
                let image = content('meta[property="og:image"]').attr('content');
                item.description = description;
                item.image = image;
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
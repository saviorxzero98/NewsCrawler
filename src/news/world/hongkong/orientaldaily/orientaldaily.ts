import { crawlerHeaders } from '../../../../services/httpclient';
import { ServiceContext } from '../../../../services/service';
import { NewsCrawler } from '../../../newsCrawler';

const rootUrl = 'https://orientaldaily.on.cc';
const title = '東方日報';

export class OrientalDailyNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(count: number = 15) {
        let url = `${rootUrl}/rss/news.xml`;

        let { list } = await this.getNewsListFromRSS({
            url,
            count
        });

        /*let items = await this.getNewsDetials({
            list,
            headers: crawlerHeaders,
            callback: (item, content, newsMeta, response) => {
                item.image = newsMeta.image;
                return item;
            }
        });*/

        return {
            title: `${title}`,
            link: rootUrl,
            items: list
        };
    }
}
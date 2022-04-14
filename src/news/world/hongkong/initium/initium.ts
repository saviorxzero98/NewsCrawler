import { crawlerHeaders } from '../../../../services/httpclient';
import { ServiceContext } from '../../../../services/service';
import { NewsCrawler } from '../../../newsCrawler';

const rootUrl = 'https://theinitium.com';
const rssUrl = 'https://theinitium.com/newsfeed';
const title = '端傳媒';

export class InitiumNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(count: number = 15) {
        let url = rssUrl;

        let { list } = await this.getNewsListFromRSS({
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
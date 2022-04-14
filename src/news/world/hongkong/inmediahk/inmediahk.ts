import { crawlerHeaders } from '../../../../services/httpclient';
import { ServiceContext } from '../../../../services/service';
import { NewsCrawler } from '../../../newsCrawler';

const rootUrl = 'https://www.inmediahk.net';
const rssUrl = 'https://www.inmediahk.net/full/feed';
const title = '獨立媒體';

export class InmediahkNewsCrawler extends NewsCrawler {
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
            title: `${title} `,
            link: rootUrl,
            items: list
        };
    }
}
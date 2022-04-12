
import { crawlerHeaders } from '../../services/httpclient';
import { NewsCrawler } from '../newsCrawler';
import { ServiceContext } from '../../services/service';

const rootUrl = 'https://bccnews.com.tw';
const title = '中廣新聞網';

const rssMap = {
    'z2': '最新',
    'c-03': '政治',
    'c-04': '國際',
    'c-05': '兩岸',
    'c-06': '財經',
    'c-07': '生活',
    'c-08': '社會',
    'c-09': '體育',
    'c-10': '娛樂',
    'c-11': '專題',
    'c-12': '地方',

    '%E6%97%85%E9%81%8A': '旅遊',
    '旅遊': '旅遊',
    '%E5%81%A5%E5%BA%B7': '健康',
    '健康': '健康',
    '%E8%B2%A1%E7%A5%9E%E7%B6%B2': '財神網',
    '財神網': '財神網'
};

export class BCCNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(rss: string = 'z2', count: number = 15) {
        if (rssMap[rss]) {
            let url = `${rootUrl}/archives/category/${rss}/feed`;

            let list = await this.getNewsListFromRSS({
                url,
                count
            });

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
                title: `${title} ${rssMap[rss]}`,
                link: url,
                items: items
            };
        }

        return {
            title: `${title}`,
            link: rootUrl,
            items: []
        };
    }
}
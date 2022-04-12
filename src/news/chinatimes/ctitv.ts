import { crawlerHeaders } from '../../services/httpclient';
import { NewsCrawler } from '../newsCrawler';
import { ServiceContext } from '../../services/service';

const rootUrl = 'https://gotv.ctitv.com.tw';
const title = '中天快點TV';

const rssMap = {
    'instant-overview': '即時總覽',
    'politics-news': '政治要聞',
    'local-news': '社會萬象',
    'share-shopping': '生活焦點',
    'international': '國際兩岸',
    'entertainment-news': '娛樂星聞',
    'baby-pets': '動物寵物',
    'advertising-news': '市場快訊'
};

export class CtiTVNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(rss: string = 'instant-overview', count: number = 15) {
        if (rssMap[rss]) {
            let url = `${rootUrl}/category/${rss}/feed`;

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
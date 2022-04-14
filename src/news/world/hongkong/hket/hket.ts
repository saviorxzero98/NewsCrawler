import { crawlerHeaders } from '../../../../services/httpclient';
import { ServiceContext } from '../../../../services/service';
import { NewsCrawler } from '../../../newsCrawler';

const rootUrl = 'https://www.hket.com';
const title = '香港經濟日報';

const rssMap = {
    finance: '財經',
    hongkong: '香港',
    china: '兩岸',
    world: '國際',
    lifestyle: '副刊',
    technology: '科技',
    entertainment: '娛樂'
}

export class HKETNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = 'hongkong', count: number = 15) {
        let categoryName = '香港';
        if (category && rssMap[category]) {
            categoryName = rssMap[category];
        }
        else {
            category = 'hongkong';
        }
        let url = `${rootUrl}/rss/${category}`;

        let { list } = await this.getNewsListFromRSS({
            url,
            count
        });

        let items = await this.getNewsDetials({
            list,
            headers: crawlerHeaders,
            callback: (item, content, newsMeta, response) => {
                item.image = newsMeta.image;
                return item;
            }
        });

        return {
            title: `${title} ${categoryName}`,
            link: rootUrl,
            items: items
        };
    }
}
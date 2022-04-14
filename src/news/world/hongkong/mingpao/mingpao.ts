import { crawlerHeaders } from '../../../../services/httpclient';
import { ServiceContext } from '../../../../services/service';
import { NewsCrawler } from '../../../newsCrawler';

const rootUrl = 'https://news.mingpao.com';
const title = '明報';
const rssMap = {
    ins: {
        all: '',
        s00001: '港聞',
        s00002: '經濟',
        s00003: '地產',
        s00004: '兩岸',
        s00005: '國際',
        s00006: '體育',
        s00007: '娛樂',
        s00022: '文摘',
        s00024: '熱點'
    },
    pns: {
        s00001: '要聞',
        s00002: '港聞',
        s00003: '社評',
        s00004: '經濟',
        s00005: '副刊',
        s00011: '教育',
        s00012: '觀點',
        s00013: '中國',
        s00014: '國際',
        s00015: '體育',
        s00016: '娛樂',
        s00017: '英文',
        s00018: '作家專欄'
    }
}


export class MingPaoNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getInsNews(category: string = 'all', count: number = 15) {
        let categoryName = '';
        if (category && rssMap.ins[category]) {
            categoryName = rssMap.ins[category];
        }
        else {
            category = 'all';
        }

        let url = `${rootUrl}/rss/ins/${category}.xml`;

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

    public async getPnsNews(category: string = 's00001', count: number = 15) {
        let categoryName = '';
        if (category && rssMap.ins[category]) {
            categoryName = rssMap.ins[category];
        }
        else {
            category = 's00001';
            categoryName = rssMap.ins[category];
        }

        let url = `${rootUrl}/rss/pns/${category}.xml`;

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

    public async getWeatherNews(count: number = 15) {
        let url = `${rootUrl}/rss/weather/rss.xml`;

        let { list } = await this.getNewsListFromRSS({
            url,
            count
        });

        return {
            title: `${title} 本港今日天氣預測`,
            link: rootUrl,
            items: list
        };
    }
}
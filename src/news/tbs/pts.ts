import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

import { ServiceContext } from '../../services/service';
import * as utils from '../../feeds/utils';
import { NewsCrawler } from '../newsCrawler';

const httpClient = axios.default;

const rootUrl = 'https://news.pts.org.tw';
const title = '公視新聞';

const categoryMap = {
    'dailynews': '即時',
    'opinion': '觀點',
    'report': '深度報導',

    '1': '政治',
    '2': '政經',
    '3': '環境',
    '4': '全球',
    '5': '生活',
    '6': '文教科技',
    '7': '社會',
    '9': '兩岸',
    '10': '產經',
    '11': '地方',
    '12': '社福人權'
}

export class PTSNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category ?: string, count: number = 15) {
        let url = `${rootUrl}/dailynews`;
        let categoryName = '即時';

        if (category && categoryMap[category]) {
            if (/^\d+$/.test(category)) {
                url = `${rootUrl}/category/${category}`;
                categoryName = categoryMap[category];
            }
            else {
                url = `${rootUrl}/${category}`;
                categoryName = categoryMap[category];
            }
        }

        this.services.logger.logGetUrl(url);
        
        let response = await httpClient.get(url, utils.crawlerOptions);
        let content = cheerio.load(response.data);

        let list = [];
        let topItem = this.getTopNews(content);
        list.push(topItem);
        if (count > 1) {
            let otherItems = this.getOtherNews(content, count - 1);
            list.push(...otherItems);
        }

        let items = await this.getNewsDetials({
            list,
            options: utils.crawlerOptions,
            callback: (item, content) => {
                let description = content('meta[property="og:description"]').attr('content');
                let image = content('meta[property="og:image"]').attr('content');
                item.description = description;
                item.image = image;
                return item;
            }
        });
        
        return {
            title: `${title} ${categoryName}`,
            link: url,
            items: items,
        };
    }

    private getTopNews(content: cheerio.CheerioAPI) {
        let item = content('div.breakingnews');

        let title = content(item).find('h2 a').text();
        let link = content(item).find('h2 a').attr('href');
        let image = content(item).find('img').attr('src');
        let pubDate = content(item).find('div.news-info time').attr('datetime');

        return {
            title,
            link,
            image: image,
            description: '',
            date: moment(pubDate, 'YYYY-MM-DD HH:mm:ss').toDate(),
        };
    }

    private getOtherNews(content: cheerio.CheerioAPI, count: number = 14) {
        let list = content('ul.news-list li.d-flex')
            .map((_, item) => {
                let title = content(item).find('h2 a').text();
                let link = content(item).find('h2 a').attr('href');
                let image = content(item).find('img').attr('src');
                let pubDate = content(item).find('div.news-info time').attr('datetime');

                return {
                    title,
                    link,
                    image: image,
                    description: '',
                    date: moment(pubDate, 'YYYY-MM-DD HH:mm:ss').toDate(),
                };
            })
            .get()
            .filter(n => n.title && n.link)
            .slice(0, count);
        return list;
    }
}
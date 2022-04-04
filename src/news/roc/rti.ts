import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

import { ServiceContext } from '../../service';
import * as utils from '../../feeds/utils';
import { NewsCrawler } from '../newsCrawler';

const httpClient = axios.default;

const rootUrl = 'https://www.rti.org.tw';
const title = 'Rti 中央廣播電台';

const categoryMap = {
    '1': '國際',
    '2': '財經',
    '3': '生活',
    '4': '兩岸',
    '5': '政治',
    '6': '專題'
};

export class RtiNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = '', count: number = 15) {
        let url = `${rootUrl}/news/list`;
        let categoryName = '總覽'
        if (category && /^\d$/.test(category) && categoryMap[category]) {
            url = `${rootUrl}/news/list/categoryId/${category}`;
            categoryName = categoryMap[category];
        }
        console.log(`GET ${url}`);

        let response = await httpClient.get(url, utils.crawlerOptions);
        let $ = cheerio.load(response.data);
        let list = $('section.newslist-box ul li')
            .slice(0, count)
            .map((_, item) => {
                let title = $(item).find('span.title').text();
                let link = rootUrl + $(item).find('a').attr('href');
                return {
                    title,
                    link,
                    image: '',
                    description: '',
                    date: new Date()
                };
            })
            .get();
            
        let items = await this.getDetials(list, async (item, data) => {
            let content = cheerio.load(data);
            let description = content('meta[property="og:description"]').attr('content');
            let image = content('meta[property="og:image"]').attr('content');
            item.description = description;
            item.image = image;

            let pubDate = content('section.news-detail-box li.date').text();
            pubDate = pubDate.replace('\n', '').replace('時間：', '').trim();
            item.date = moment(pubDate, 'YYYY-MM-DD HH:mm').toDate();

            //let description = content('article').html();

            return item;
        }, utils.crawlerOptions);

        return {
            title: `${title} ${categoryName}`,
            link: url,
            items: items,
        };
    }
}
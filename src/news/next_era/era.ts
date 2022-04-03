import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';
import * as utils from '../../feeds/utils';

const httpClient = axios.default;

const rootUrl = 'https://www.eracom.com.tw';
const title = '年代新聞'

const categoryMap = {
    political: '政治',
    LocalNews: '地方',
    Society: '社會',
    Life: '生活',
    WorldNews: '國際',
    Entertainment: '娛樂',
    Sport: '體育',
    Finance: '財經',
    Astro: '命理',
    Art: '藝文',
    Food: '美食'
};

export class ERANewsCrawler {
    public static async  getNews(category: string = 'political', count: number = 15) {
        let url = `${rootUrl}/EraNews/Home/${category}`;
        console.log(`GET ${url}`);

        let response = await httpClient.get(url);
        let $ = cheerio.load(response.data);
        let list = $('div.newslist ul.clearfix li')
            .slice(0, count)
            .map((_, item) => {
                let title = $(item).find('div.tib-desc p.tib-title').text();
                let link = $(item).find('div.tib-txt a').attr('href');
                let image = $(item).find('div.tib-txt img').attr('src');
                let description = $(item).find('div.tib-desc a.detail-link').text();
                let pubDate = $(item).find('div.tib-desc p.date').text();

                return {
                    title,
                    link,
                    image,
                    description,
                    date: moment(pubDate, 'YYYY-MM-DD HH:mm:ss').toDate(),
                };
            })
            .get();
            
        return {
            title: `${title} ${categoryMap[category]}`,
            link: url,
            items: list,
        };
    }
}
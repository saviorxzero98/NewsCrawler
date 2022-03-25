import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

const httpClient = axios.default;

const rootUrl = 'https://www.eracom.com.tw';
const title = '年代新聞'

export class ERANewsCrawler {
    public static async  getNews(page: string = 'political', count: number = 25) {
        let url = `${rootUrl}/EraNews/Home/${page}`;
        let response = await httpClient.get(url);
        let $ = cheerio.load(response.data);
        let list = $('div.newslist ul.clearfix li')
            .slice(0, count)
            .map((_, item) => {
                let title = $(item).find('div.tib-desc p.tib-title').text();
                let link = $(item).find('div.tib-txt a').attr('href');
                let image = $(item).find('div.tib-txt img').attr('src');
                let content = $(item).find('div.tib-desc a.detail-link').text();
                let pubDate = $(item).find('div.tib-desc p.date').text();

                return {
                    title,
                    link,
                    image,
                    content,
                    pubDate,
                };
            })
            .get();
            
        return {
            title: `${title}`,
            link: url,
            item: list,
        };
    }
}
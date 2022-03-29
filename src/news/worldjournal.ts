import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

const httpClient = axios.default;

const rootUrl = 'https://www.worldjournal.com';
const title = '世界新聞網';

export class WorldJournalNewsCrawler {
    public static async getNews(page: string = '0', count: number = 25) {
        let url = `${rootUrl}/wj/cate/breaking/${page}`;
        let response = await httpClient.get(url);
        let $ = cheerio.load(response.data);

        let list = $('div#breaknews div.subcate-list__link')
            .slice(0, count)
            .map((_, item) => {
                let title = $(item).find('h3.subcate-list__link__title').text();
                let link = $(item).find('a').attr('href');
                let image = $(item).find('img').attr('data-src');
                let content = $(item).find('p.subcate-list__link__content').text();
                let pubDate = $(item).find('span.subcate-list__time--roc').text();
                
                return {
                    title,
                    link,
                    content,
                    image,
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
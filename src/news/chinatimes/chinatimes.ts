import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

const httpClient = axios.default;

const rootUrl = 'https://www.chinatimes.com';
const title = '中時電子報';

export class ChinaTimesNewsCrawler {
    public static async  getNews(page: string = 'realtimenews', count: number = 20) {
        let url = `${rootUrl}/${page}/?chdtv`;
    
        const response = await httpClient.get(url);
    
        const $ = cheerio.load(response.data);

        const list = $('section.article-list ul div.row')
            .slice(0, count)
            .map((_, item) => {
                const title = $(item).find('h3.title a').text();
                const link = rootUrl + $(item).find('h3.title a').attr('href');
                const content = $(item).find('p.intro').text();
                const image = $(item).find('img.photo').attr('src');
                const pubDate = $(item).find('time').attr('datetime');

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
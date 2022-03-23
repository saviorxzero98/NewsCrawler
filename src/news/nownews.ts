import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

const httpClient = axios.default;

const rootUrl = 'https://www.nownews.com/';
const title = 'Nownews';

export class NownewsNewsCrawler {
    public static async  getNews(page: string = 'breaking', count: number = 25) {
        let url = `${rootUrl}/cat/${page}`;
        let response = await httpClient.get(url);
        let $ = cheerio.load(response.data);
        let list = $('div.listBlk ul li')
            .slice(0, count)
            .map((_, item) => {
                let title = $(item).find('div.txt h2').text();
                let link = rootUrl + $(item).find('a').attr('href');
                let pubDate = $(item).find('div.txt p.time').text();

                return {
                    title,
                    link,
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
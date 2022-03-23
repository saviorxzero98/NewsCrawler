import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

const httpClient = axios.default;

const rootUrl = 'https://nba.udn.com/';
const title = 'NBA 台灣';

export class NBATaiwanNewsCrawler {
    public static async getNews(page: string = 'newest', count: number = 25) {
        let url = `${rootUrl}/nba/cate/6754/-1//${page}`;
        let response = await httpClient.get(url);
        let $ = cheerio.load(response.data);
        let list = $('div#news_list_body dt')
            .slice(0, count)
            .map((_, item) => {
                let title = $(item).find('h3').text();
                let link = rootUrl + $(item).find('a').attr('href');
                let content = $(item).find('p').text();
                let pubDate = $(item).find('b').text();
                
                return {
                    title,
                    link,
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
import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

const httpClient = axios.default;

const rootUrl = 'https://www.nexttv.com.tw';
const title = '壹電視新聞';

export class NextTVNewsCrawler {
    public static async  getNews(page: string = 'OnlineLatestNews', count: number = 25) {
        let url = `${rootUrl}/NextTV/News/Home/${page}`;
        let response = await httpClient.get(url);
        let $ = cheerio.load(response.data);
        let list = $('ul.yxw_list li')
            .slice(0, count)
            .map((_, item) => {
                let title = $(item).find('div.tit a').text();
                let link = $(item).find('a.more').attr('href');
                let content = $(item).find('div.brief').text();
                let pubDate = $(item).find('div.time').text();

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
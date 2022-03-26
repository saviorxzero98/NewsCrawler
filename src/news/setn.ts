import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

const httpClient = axios.default;

const rootUrl = 'https://www.setn.com';
const title = '三立新聞';

export class SETNewsCrawler {
    public static async  getNews(page: string = '', count: number = 25) {
        let url = `${rootUrl}/ViewAll.aspx`;
        if (page && /^\d+$/.test(page)) {
            url = `${url}?PageGroupID=${page}`;
        }
        let response = await httpClient.get(url);
        let $ = cheerio.load(response.data);
        let list = $('div.newsItems')
            .slice(0, count)
            .map((_, item) => {
                let title = $(item).find('a.gt').text();
                let link = $(item).find('a.gt').attr('href');
                if (!link.startsWith('https:')) {
                    link = rootUrl + link;
                }
                let pubDate = moment($(item).find('time').text(), 'MM/DD HH:mm').format('yyyy-MM-DD HH:mm');

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
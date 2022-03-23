import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

const httpClient = axios.default;

const rootUrl = 'https://news.tvbs.com.tw';
const title = 'TVBS新聞';

export class TVBSNewsCrawler {
    public static async  getNews(page: string = '', count: number = 25) {
        let url = `${rootUrl}/realtime/${page}`;
        let response = await httpClient.get(url);
        let $ = cheerio.load(response.data);
        let list = $('div.news_list div.list ul li')
            .slice(0, count)
            .map((_, item) => {
                
                let title = $(item).find('a h2').text();
                let link = rootUrl + $(item).find('a').attr('href');
                let image = $(item).find('a img.lazyimage').attr('src');
                let pubDate = $(item).find('div.time').text();

                return {
                    title,
                    link,
                    image,
                    pubDate,
                };
            })
            .get()
            .filter(item => item && item.title && item.link);

        return {
            title: `${title}`,
            link: url,
            item: list,
        };
    }
}
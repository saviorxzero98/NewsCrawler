import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

const httpClient = axios.default;

const rootUrl = 'https://www.ntdtv.com.tw/';
const title = '新唐人亞太電視台';

export class NTDTVTwNewsCrawler {
    public static async getNews(page: string = '要聞', count: number = 25) {
        let url = `${rootUrl}/news/${encodeURIComponent(page)}`;
        let response = await httpClient.get(url);
        let $ = cheerio.load(response.data);

        let topItem = NTDTVTwNewsCrawler.getTopNews($);
        let list = $('div.pane_list ul li')
            .slice(0, count)
            .map((_, item) => {
                let title = $(item).find('h3').text();
                let link = rootUrl + $(item).find('a').attr('href');
                let image = 'https:' + $(item).find('img').attr('data-src-small');
                let content = $(item).find('p').text();
                let pubDate = $(item).find('div.article_time').text();


                return {
                    title,
                    link,
                    image,
                    content,
                    pubDate,
                };
            })
            .get()
            .filter(n => n.title);
            
        return {
            title: `${title}`,
            link: url,
            item: [ topItem, ...list ],
        };
    }

    private static getTopNews($: cheerio.CheerioAPI) {
        let item = $('div.Headlines_photo');

        let title = item.find('h3').text();
        let link = rootUrl + item.find('a').attr('href');
        let image = 'https:' + item.find('img').attr('data-src-small');
        let content = item.find('p').text();
        let pubDate = item.find('div.article_time').text();


        return {
            title,
            link,
            image,
            content,
            pubDate,
        };
    }
}
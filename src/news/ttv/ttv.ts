import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

const httpClient = axios.default;

const rootUrl = 'https://news.ttv.com.tw';
const title = '台視新聞';

export enum TTVChannel {
    realtime = '即時'
}

export class TTVNewsCrawler {
    public static async getNews(page: string = 'realtime', count: number = 25) {
        let url = `${rootUrl}/${page}`;
        let response = await httpClient.get(url);
        let list = TTVNewsCrawler.getTTVNews(response.data, count);

        return {
            title: `${title}`,
            link: url,
            item: list,
        };
    }

    public static async getNewsByCategory(category: string, count: number = 25) {
        let url = `${rootUrl}/category/${encodeURIComponent(category)}`;
        let response = await httpClient.get(url);
        let list = TTVNewsCrawler.getTTVNews(response.data, count);
        
        return {
            title: `${title} - ${category}`,
            link: url,
            item: list,
        };
    }

    private static getTTVNews(data: any, count: number) {
        let $ = cheerio.load(data);
        let list = $('article.container div.news-list ul li')
            .slice(0, count)
            .map((_, item) => {
                let title = $(item).find('a div.title').text();
                let link = $(item).find('a').attr('href');
                let image = $(item).find('a img').attr('src');
                let description = $(item).find('div.summary').text();
                let pubDate = $(item).find('div.time').text();

                return {
                    title,
                    description,
                    link,
                    image,
                    pubDate,
                };
            })
            .get()
            .filter(item => item && item.title && item.link);

        return list;
    }
}
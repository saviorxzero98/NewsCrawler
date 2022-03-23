import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

const httpClient = axios.default;

const rootUrl = 'https://www.ftvnews.com.tw/';
const title = '民視新聞';

export class FTVNewsCrawler {
    public static async getNews(page: string = 'home', count: number = 25) {
        let url = `${rootUrl}/${page}`;
        let response = await httpClient.get(url);
        let $ = cheerio.load(response.data);
        let list = $('div.news-block')
            .slice(0, count)
            .map((_, item) => {
                const title = $(item).find('div.news-block div.content a h2').text();
                const link = rootUrl + $(item).find('div.content a').attr('href');
                const content = $(item).find('div.content div.desc').text();
                const pubDate = $(item).find('div.time').text();

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

    public static async getNewsByTag(tag: string, count: number = 25) {
        let url = `${rootUrl}/tag/${encodeURIComponent(tag)}`;
        let response = await httpClient.get(url);
        let $ = cheerio.load(response.data);
        let list = $('section.news-list ul li')
            .slice(0, count)
            .map((_, item) => {
                let title = $(item).find('a div.content h2').text();
                let link = rootUrl + $(item).find('a').attr('href');
                let pubDate = $(item).find('a div.content div.time').text();

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
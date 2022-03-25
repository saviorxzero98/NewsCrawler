import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

const httpClient = axios.default;

const rootUrl = 'https://www.ftvnews.com.tw/';
const title = '民視新聞';

export class FTVNewsCrawler {
    public static async getNews(page: string = 'realtime', count: number = 25) {
        let url = `${rootUrl}/${page}`;
        let response = await httpClient.get(url);
        let $ = cheerio.load(response.data);
        let list = $('div.news-block')
            .slice(0, count)
            .map((_, item) => {
                let title = $(item).find('div.news-block div.content a h2').text();
                let link = rootUrl + $(item).find('div.content a').attr('href');
                let image = $(item).find('a.img-block img').attr('src');
                let content = $(item).find('div.content div.desc').text();
                let pubDate = $(item).find('div.time').text();

                return {
                    title,
                    link,
                    image,
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
                let image = $(item).find('div.img-block img').attr('src');
                let pubDate = $(item).find('a div.content div.time').text();

                return {
                    title,
                    link,
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
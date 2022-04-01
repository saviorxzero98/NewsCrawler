import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

const httpClient = axios.default;

const rootUrl = 'https://www.merit-times.com';
const title = '人間福報';

const vegemapRootUrl = 'https://vegemap.merit-times.com';
const vegemapTitle = '蔬福生活';

export class MeritTimesNewsCrawler {
    public static async  getNews(page: string = '7', count: number = 25) {
        let url = `${rootUrl}/PageList.aspx?classid=${page}`;

        let response = await httpClient.get(url);
        let $ = cheerio.load(response.data);
        let list = $('section div.news')
            .slice(0, count)
            .map((_, item) => {
                let title = $(item).find('div.newsTxt a.newsLink').text();
                let link = rootUrl + '/' + $(item).find('div.newsTxt a.newsLink').attr('href');
                let image = rootUrl + '/' + $(item).find('a.newsImg img').attr('src');
                let content = $(item).find('div.newsTxt p').text();
                let pubDate = $(item).find('div.newsDate').text();

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

    public static async  getVegemapNews(page: string = '', count: number = 25) {
        let url = `${vegemapRootUrl}/veganews_list`;
        if (page) {
            url = `${url}?id=${page}`
        }

        let response = await httpClient.get(url);
        let $ = cheerio.load(response.data);
        let list = $('div.proList div.B_item_masterlist')
            .slice(0, count)
            .map((_, item) => {
                let title = $(item).find('div.masterTitle span').text();
                let link = vegemapRootUrl + $(item).find('a').attr('href');
                let image = vegemapRootUrl + $(item).find('img').attr('src');

                return {
                    title,
                    link,
                    image,
                };
            })
            .get();
            
        return {
            title: `${vegemapTitle}`,
            link: url,
            item: list,
        };
    }
}
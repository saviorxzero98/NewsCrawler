import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

const httpClient = axios.default;

const rootUrl = 'https://newtalk.tw/';
const title = '新頭殼';

export class NewtalkNewsCrawler {
    public static async getNews(page: string = '', count: number = 25) {
        let url = `${rootUrl}/news/summary/today`;
        if (page) {
            url = `${rootUrl}/news/subcategory/${page}`;
        }
        let response = await httpClient.get(url);
        let content = cheerio.load(response.data);
        
        let topNewsList = await NewtalkNewsCrawler.getTopNews(content);
        let nextNewsList = await NewtalkNewsCrawler.getNextNews(content);
        let list = [ ...topNewsList, ...nextNewsList ];

            
        return {
            title: `${title}`,
            link: url,
            item: list.slice(0, count)
        };
    }

    private static async getTopNews(content: cheerio.CheerioAPI) {
        let list = content('div.news-top2 div.newsArea')
            .map((_, item) => {
                let title = content(item).find('div.news-title a').text();
                let link = content(item).find('a').attr('href');
                let image = content(item).find('div.news-img img').attr('src');

                return {
                    title,
                    link,
                    image,
                    content: '',
                    pubDate: '',
                };
            })
            .get();
    
        let items = await Promise.all(
            list.map(async (item) => {
                    let detailResponse = await httpClient.get(item.link);
                    let content = cheerio.load(detailResponse.data);
                    let pubDate = content('div.content_date').text();
                    pubDate = pubDate.replace('發布', '')
                                 .replace('|', '')
                                 .trim();
                    pubDate = moment(pubDate, 'yyyy.MM.DD HH:mm').format('yyyy-MM-DD HH:mm');

                    item.pubDate = pubDate;
                    return item;
                } 
            )
        );

        return items;
    }

    private static async getNextNews(content: cheerio.CheerioAPI) {
        let list = content('div.news-list div.news-list-item')
            .map((_, item) => {
                let title = content(item).find('div.news_title').text();
                title = title.replace('\n', '').trim();
                let link = content(item).find('a').attr('href');
                let image = content(item).find('div.news_img img').attr('src');
                let summary = content(item).find('div.news_text a').text();
                let pubDate = content(item).find('div.news_date').text();
                pubDate = pubDate.replace('發布', '')
                                 .replace('|', '')
                                 .trim();
                pubDate = moment(pubDate, 'yyyy.MM.DD HH:mm').format('yyyy-MM-DD HH:mm');

                return {
                    title,
                    link,
                    image,
                    content: summary,
                    pubDate,
                };
            })
            .get();
        return list;
    }
}
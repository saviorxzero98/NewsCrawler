import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

const httpClient = axios.default;

const rootUrl = 'https://healthmedia.com.tw';
const title = 'NOW健康';

export class HealthMediaNewsCrawler {
    public static async  getNews(page: string = '1', id: string = '', count: number = 25) {
        let url = '';
        if (id) {
            url = `${rootUrl}/main.php?nm_id=${id}`;
        }
        else {
            url = `${rootUrl}/main.php?nm_class=${page}`;
        }

        let response = await httpClient.get(url);
        let $ = cheerio.load(response.data);
        let list = $('div.main_news_list li')
            .slice(0, count)
            .map((_, item) => {
                let title = $(item).find('div.main_news_txt h2').text();
                let link = rootUrl + '/' + $(item).find('a').attr('href');
                let image = rootUrl + '/' + $(item).find('a img').attr('src');
                let content = $(item).find('div.main_news_content').text();
                let pubDate = $(item).find('div.ti_left time').text();

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
            title: `${title} ${$('main_title').text()}`,
            link: url,
            item: list,
        };
    }
}
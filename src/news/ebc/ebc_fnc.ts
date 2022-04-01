import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

const httpClient = axios.default;

const rootUrl = 'https://fnc.ebc.net.tw';
const title = '東森財經新聞';
const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36';


export class EBCFncNewsCrawler {
    public static async getNews(page: string = 'realtime', count: number = 25) {
        let url = `${rootUrl}/fncnews/${page}`;
        let option = {
            headers: {
                'User-Agent': userAgent
            }
        }
        let response = await httpClient.get(url, option);
        let $ = cheerio.load(response.data);
        let list = $('div.fncnews-list-box div.white-box')
            .slice(0, count)
            .map((_, item) => {
                let title = $(item).find('div.text p').text();
                let link = rootUrl + $(item).find('a').attr('href');
                let image = $(item).find('div.pic div.target-img img').attr('src');
                let pubDate = moment($(item).find('div.text span.small-gray-text').text(), '(yyyy/MM/DD HH:mm)').format('yyyy-MM-DD HH:mm');
                
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
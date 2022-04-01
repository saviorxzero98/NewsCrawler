import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

const httpClient = axios.default;

const rootUrl = 'https://news.ebc.net.tw';
const title = '東森新聞';
const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36';


export class EBCNewsCrawler {
    public static async getNews(page: string = 'realtime', count: number = 25) {
        let url: string;

        if (page === 'realtime' || page === 'hot') {
            url = `${rootUrl}/${page}`;
        }
        else {
            url = `${rootUrl}/news/${page}`;
        }

        let option = {
            headers: {
                'User-Agent': userAgent
            }
        }
        let response = await httpClient.get(url, option);
        let $ = cheerio.load(response.data);
        let list = $('div.news-list-box div.white-box')
            .slice(0, count)
            .map((_, item) => {
                let title = $(item).find('div.text span.title').text();
                let link = rootUrl + $(item).find('a').attr('href');
                let image = $(item).find('div.pic div.target-img img').attr('src');
                let content = $(item).find('div.text span.summary').text();
                let pubDate = moment($(item).find('div.text span.small-gray-text').text(), 'MM/DD HH:mm').format('yyyy-MM-DD HH:mm');
                
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
}
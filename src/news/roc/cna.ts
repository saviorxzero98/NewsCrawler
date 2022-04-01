import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

const httpClient = axios.default;

const rootUrl = 'https://www.cna.com.tw';
const title = '中央社';

export class CNANewsCrawler {
    public static async  getNews(page: string = 'aall', count: number = 20) {
        let url = '';
        if (/^\d+$/.test(page)) {
            url = `${rootUrl}/topic/newstopic/${page}.aspx`;
        } 
        else {
            url = `${rootUrl}/list/${page}.aspx`;
        }
    
        const response = await httpClient.get(url);
    
        const $ = cheerio.load(response.data);

        const list = $('#jsMainList li')
            .slice(0, count)
            .map((_, item) => {
                let title = $(item).find('h2').text();
                let link = $(item).find('a').attr('href');
                let image = $(item).find('div.wrap img').attr('src') || '';
                let pubDate = $(item).find('div.date').text();
                pubDate =  moment(pubDate, 'yyyy/MM/DD HH:mm').format('yyyy-MM-DD HH:mm');

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
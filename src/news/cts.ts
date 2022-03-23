import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

const httpClient = axios.default;

const rootUrl = 'https://news.cts.com.tw';
const title = '華視新聞';

export class CTSNewsCrawler {
    public static async getNews(page: string = 'real', count: number = 25) {
        let url = `${rootUrl}/${page}/index.html`;
        let response = await httpClient.get(url);
        let $ = cheerio.load(response.data);
        let list = $('div.newslist-container a')
            .slice(0, count)
            .map((_, item) => {
                let pubDate = moment($(item).find('p.newstitle span.newstime').text(), 'yyyy/MM/DD HH:mm').format('yyyy-MM-DD HH:mm');
                $(item).find('p.newstitle span.newstime').remove();
                let title = $(item).find('p.newstitle').text();
                let image = $(item).find('div.newsimg-thumb img').attr('src');
                let link = $(item).attr('href');
                let description = '';
                if (image) {
                    description = `<p><img src="${image}"></p>`;
                }

                return {
                    title,
                    link,
                    image,
                    description,
                    pubDate,
                };
            })
            .get();
        /*    
        let items = await Promise.all(
            list.map(async (item) => {
                let detailResponse = await httpClient.get(item.link);
                let content = cheerio.load(detailResponse.data);
                
                item.description = content('div.artical-content').html();
            })
        );*/
        
        return {
            title: `${title}`,
            link: url,
            item: list,
        };
    }
}
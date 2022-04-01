import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

const httpClient = axios.default;

const rootUrl = 'https://www.rti.org.tw';
const title = 'Rti 中央廣播電台';

export class RtiNewsCrawler {
    public static async  getNews(page: string = '', count: number = 25) {
        let url = `${rootUrl}/news/list`;
        if (page) {
            url = `${rootUrl}/news/list/categoryId/${page}`;
        }        
        let response = await httpClient.get(url);
        let $ = cheerio.load(response.data);
        let list = $('section.newslist-box ul li')
            .slice(0, count)
            .map((_, item) => {
                let title = $(item).find('span.title').text();
                let link = rootUrl + $(item).find('a').attr('href');
                let image = $(item).find('span.img').attr('style');
                image = image.replace('background-image:url(', '')
                             .replace('.png)', '.png');

                return {
                    title,
                    link,
                    pubDate: '',
                    image,
                    description: ''
                };
            })
            .get();
            
        let items = await Promise.all(
            list.map(async (item) => {
                    let detailResponse = await httpClient.get(item.link);
                    let content = cheerio.load(detailResponse.data);
                    let date = content('section.news-detail-box li.date').text();
                    date = date.replace('\n', '')
                               .replace('時間：', '')
                               .trim();

                    item.pubDate = date;
                    return item;
                } 
            )
        );

        return {
            title: `${title}`,
            link: url,
            item: items,
        };
    }
}
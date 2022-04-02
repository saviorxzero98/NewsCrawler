import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

const httpClient = axios.default;

const rootUrl = 'https://www.mirrormedia.mg';
const title = '鏡周刊';

export class MirrorMediaNewsCrawler {
    public static async  getNews(section: string = 'news', category: string = '', count: number = 25) {
        let url = '';
        if (category) {
            url = `${rootUrl}/category/${category}`;
        }
        else {
            url = `${rootUrl}/section/${section}`;
        }

        let response = await httpClient.get(url);
        let $ = cheerio.load(response.data);
        let list = $('section.article-list li.list__list-item')
            .slice(0, count)
            .map((_, item) => {
                let title = $(item).find('div.article__bottom-wrapper h1').text();
                let link = rootUrl + $(item).find('a').attr('href');
                let image = rootUrl + $(item).find('div.article__top-wrapper img').attr('data-src');
                let content = $(item).find('div.article__bottom-wrapper p').text();
                //let pubDate = $(item).find('div.ti_left time').text();

                return {
                    title,
                    link,
                    image,
                    content,
                    //pubDate,
                };
            })
            .get()
            .filter(i => i.title && i.link);
            
        return {
            title: `${title}`,
            link: url,
            item: list,
        };
    }
}
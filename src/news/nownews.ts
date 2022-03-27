import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

const httpClient = axios.default;

const rootUrl = 'https://www.nownews.com';
const title = 'Nownews';

export class NownewsNewsCrawler {
    public static async getNews(page: string = 'breaking', subpage: string = '', count: number = 25) {
        let url = `${rootUrl}/cat/${page}`;

        if (subpage) {
            url = `${url}/${subpage}`;
        }

        let response = await httpClient.get(url);
        let content = cheerio.load(response.data);

        let top5List = await NownewsNewsCrawler.getTop5News(content)
        let next5List = await NownewsNewsCrawler.getNextNews(content);
        let list = [
            ...top5List,
            ...next5List
        ]
        return {
            title: `${title}`,
            link: url,
            item: list.slice(0, count)
        };
    }

    private static async getTop5News(content: cheerio.CheerioAPI) {
        let list = content('div.sliderBlk div.swiper-slide')
            .map((_, item) => {
                let title = content(item).find('a.trace-click img').attr('alt');
                let link = content(item).find('a.trace-click').attr('href');
                let image = content(item).find('a.trace-click img').attr('src');

                return {
                    title,
                    link,
                    image,
                    pubDate: '',
                };
            })
            .get();

        let items = await Promise.all(
            list.map(async (item) => {
                    let detailResponse = await httpClient.get(item.link);
                    let content = cheerio.load(detailResponse.data);
                    let date = content('div.titleBlk p.time a').text();

                    item.pubDate = date;
                    return item;
                } 
            )
        );

        return items;
    }

    private static async getNextNews(content: cheerio.CheerioAPI) {
        let list = content('div.listBlk ul li')
            .map((_, item) => {
                let title = content(item).find('div.txt h2').text() ||
                            content(item).find('div.txt h3').text();
                let link = rootUrl + content(item).find('a').attr('href');
                let image = content(item).find('img.resize').attr('src');
                let pubDate = content(item).find('div.txt p.time').text();

                return {
                    title,
                    link,
                    image,
                    pubDate,
                };
            })
            .get();
        return list;
    }
}
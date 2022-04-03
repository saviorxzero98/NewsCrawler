import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';
import * as utils from '../../feeds/utils';

const httpClient = axios.default;

const rootUrl = 'https://fnc.ebc.net.tw';
const title = '東森財經新聞';

const categoryMap = {
    headline: '焦點',
    video: '影音',
    business: '產業',
    politics: '政治',
    world: '全球',
    stock: '台股',
    house: '房產',
    cars: '汽車',
    money: '理財',
    tech: '3C',
    life: '生活',
    jobs: '職場',
    read: '正能量',
    fashion: '流行時尚',
    else: '其他'
}

export class EBCFncNewsCrawler {
    public static async getNews(category: string = '', count: number = 15) {
        let url = `${rootUrl}/fncnews/${category}`;
        console.log(`GET ${url}`);
        let categoryName = categoryMap[category] ?? '最新';

        let response = await httpClient.get(url, utils.crawlerOptions);
        let $ = cheerio.load(response.data);
        let list = $('div.fncnews-list-box div.white-box')
            .map((_, item) => {
                let title = $(item).find('div.text p').text();
                let link = rootUrl + $(item).find('a').attr('href');
                //let image = $(item).find('div.pic div.target-img img').attr('src');
                let pubDate = $(item).find('div.text span.small-gray-text').text();
                
                return {
                    title,
                    link,
                    image: '',
                    description: '',
                    date: moment(pubDate, '(yyyy/MM/DD HH:mm)').toDate(),
                };
            })
            .get()
            .filter(i => i.title && i.link)
            .slice(0, count);
            
        let items = await Promise.all(
            list.map(async (item) => {
                let detailResponse = await httpClient.get(item.link, utils.crawlerOptions);
                let content = cheerio.load(detailResponse.data);
                let description = content('meta[property="og:description"]').attr('content');
                let image = content('meta[property="og:image"]').attr('content');
                item.description = description;
                item.image = image;
                return item;
            })
        );
        
        return {
            title: `${title} ${categoryName}`,
            link: url,
            items: items,
        };
    }
}
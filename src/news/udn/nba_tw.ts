import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

import { ServiceContext } from '../../service';
import * as utils from '../../feeds/utils';
import { NewsCrawler } from '../newsCrawler';

const httpClient = axios.default;

const rootUrl = 'https://nba.udn.com';
const title = 'NBA 台灣';

const categoryMap = {
    newest: '最新',
    hottest: '熱門'
};

export class NBATaiwanNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }
    
    public async getNews(category: string = 'newest', count: number = 15) {
        let url = `${rootUrl}/nba/cate/6754/-1/${category}`;
        let response = await httpClient.get(url, utils.crawlerOptions);
        console.log(`GET ${url}`);

        let $ = cheerio.load(response.data);
        let list = $('div#news_list_body dt')
            .slice(0, count)
            .map((_, item) => {
                let title = $(item).find('h3').text();
                let link = rootUrl + $(item).find('a').attr('href');
                //let image = $(item).find('img').attr('data-src');
                //let description = $(item).find('p').text();
                //let pubDate = $(item).find('b').text();

                return {
                    title,
                    link,
                    image: '',
                    description: '',
                    date: new Date(),
                };
            })
            .get();
            
        let items = await this.getDetials(list, async (item, data) => {
            let content = cheerio.load(data);
            let description = content('meta[property="og:description"]').attr('content');
            let image = content('meta[property="og:image"]').attr('content');
            let pubDate = content('meta[name="date.available"]').attr('content');
            item.description = description;
            item.image = image;
            item.date = moment(pubDate, 'YYYY/MM/DD HH:mm:ss').toDate();
            return item;
        }, utils.crawlerOptions);

        return {
            title: `${title} ${categoryMap[category]}`,
            link: url,
            items: items,
        };
    }
}
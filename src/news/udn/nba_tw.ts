import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

import { ServiceContext } from '../../app';
import * as utils from '../../feeds/utils';

const httpClient = axios.default;

const rootUrl = 'https://nba.udn.com';
const title = 'NBA 台灣';

const categoryMap = {
    newest: '最新',
    hottest: '熱門'
};

export class NBATaiwanNewsCrawler {
    private services: ServiceContext;
    constructor(services: ServiceContext) {
        this.services = services;
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
            
        let items = await Promise.all(
            list.map(async (item) => 
                this.services
                    .cache
                    .tryGet(item.link, async () => {
                        let detailResponse = await httpClient.get(item.link, utils.crawlerOptions);
                        let content = cheerio.load(detailResponse.data);
                        let description = content('meta[property="og:description"]').attr('content');
                        let image = content('meta[property="og:image"]').attr('content');
                        let pubDate = content('meta[name="date.available"]').attr('content');
                        item.description = description;
                        item.image = image;
                        item.date = moment(pubDate, 'YYYY/MM/DD HH:mm:ss').toDate();
                        return item;
                    })
            )
        );

        return {
            title: `${title} ${categoryMap[category]}`,
            link: url,
            items: items,
        };
    }
}
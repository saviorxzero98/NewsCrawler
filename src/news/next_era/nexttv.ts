import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

import { ServiceContext } from '../../service';

const httpClient = axios.default;

const rootUrl = 'https://www.nexttv.com.tw';
const title = '壹電視新聞';

const categoryMap = {
    Politics: '政治',
    LocalNews: '地方',
    Society: '社會',
    Life: '生活',
    WorldNews: '國際',
    China: '兩岸',
    healthy: '健康',
    Entertainment: '娛樂',
    Sport: '體育',
    Finance: '財經'
};

export class NextTVNewsCrawler {
    private services: ServiceContext;
    constructor(services: ServiceContext) {
        this.services = services;
    }
    
    public async getNews(category: string = 'OnlineLatestNews', count: number = 15) {
        let url = `${rootUrl}/NextTV/News/Home/${category}`;
        console.log(`GET ${url}`);

        let response = await httpClient.get(url);
        let $ = cheerio.load(response.data);
        let list = $('ul.yxw_list li')
            .slice(0, count)
            .map((_, item) => {
                let title = $(item).find('div.tit a').text();
                let link = $(item).find('a.more').attr('href');
                let image = $(item).find('div.imgbox img').attr('src');
                let description = $(item).find('div.brief').text();
                let pubDate = $(item).find('div.time').text();

                return {
                    title,
                    link,
                    image,
                    description,
                    date: moment(pubDate, 'YYYY-MM-DD HH:mms').toDate(),
                };
            })
            .get();
            
        return {
            title: `${title} ${categoryMap[category]}`,
            link: url,
            items: list,
        };
    }
}
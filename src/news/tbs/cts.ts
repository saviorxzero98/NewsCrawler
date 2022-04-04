import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

import { ServiceContext } from '../../service';
import * as utils from '../../feeds/utils';

const httpClient = axios.default;

const rootUrl = 'https://news.cts.com.tw';
const title = '華視新聞';

const channelMap = {
    real: '即時',
    weather: '氣象',
    politics: '政治',
    international: '國際',
    society: '社會',
    sports: '運動',
    life: '生活',
    money: '財經',
    local: '地方',
    general: '綜合',
    arts: '藝文',
    entertain: '娛樂'
};

export class CTSNewsCrawler {
    private services: ServiceContext;
    constructor(services: ServiceContext) {
        this.services = services;
    }

    public async getNews(page: string = 'real', count: number = 15) {
        let url = `${rootUrl}/${page}/index.html`;
        console.log(`GET ${url}`);
        
        let response = await httpClient.get(url, utils.crawlerOptions);
        let $ = cheerio.load(response.data);
        let list = $('div.newslist-container a')
            .slice(0, count)
            .map((_, item) => {
                let pubDate = moment($(item).find('p.newstitle span.newstime').text(), 'yyyy/MM/DD HH:mm').format('yyyy-MM-DD HH:mm');
                $(item).find('p.newstitle span.newstime').remove();
                let title = $(item).find('p.newstitle').text();
                //let image = $(item).find('div.newsimg-thumb img').attr('src');
                let link = $(item).attr('href');

                return {
                    title,
                    link,
                    image: '',
                    description: '',
                    date: moment(pubDate, 'YYYY/MM/DD HH:mm').toDate(),
                };
            })
            .get();
            

        let items = await Promise.all(
            list.map(async (item) => 
                this.services
                    .cache
                    .tryGet(item.link, async () => {
                        let detailResponse = await httpClient.get(item.link);
                        let content = cheerio.load(detailResponse.data);
                        let description = content('meta[property="og:description"]').attr('content');
                        let image = content('meta[property="og:image"]').attr('content');
                        item.description = description;
                        item.image = image;

                        //content('div.artical-content div.cts-tbfs').remove();
                        //content('div.artical-content p.news-src').remove();
                        //let description = content('div.artical-content').html();
                        
                        return item;
                    })
            )
        );
        
        return {
            title: `${title} ${channelMap[page]}`,
            link: url,
            items: items,
        };
    }
}
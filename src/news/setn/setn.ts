import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

import { ServiceContext } from '../../app';
import * as utils from '../../feeds/utils';

const httpClient = axios.default;

const rootUrl = 'https://www.setn.com';
const title = '三立新聞';

const pageMap = {
    '0': '熱門',
    '2': '財經',
    '4': '生活',
    '5': '國際',
    '6': '政治',
    '7': '科技',
    '9': '名家',
    '12': '汽車',
    '31': 'HOT焦點',
    '34': '運動',
    '41': '社會',
    '42': '新奇',
    '47': '寵物',
    '65': '健康',
    '97': '地方'
}

export class SETNewsCrawler {
    private services: ServiceContext;
    constructor(services: ServiceContext) {
        this.services = services;
    }
    
    public async getNews(page: string = '', count: number = 15) {
        let url = `${rootUrl}/ViewAll.aspx`;
        let pageName = '即時';
        if (page && /^\d+$/.test(page)) {
            url = `${url}?PageGroupID=${page}`;
            pageName = pageMap[page];
        }
        console.log(`GET ${url}`);
        
        let response = await httpClient.get(url, utils.crawlerOptions);
        let $ = cheerio.load(response.data);
        let list = $('div.newsItems')
            .slice(0, count)
            .map((_, item) => {
                let title = $(item).find('a.gt').text();
                let link = $(item).find('a.gt').attr('href');
                if (!link.startsWith('https:')) {
                    link = rootUrl + link;
                }
                let pubDate = $(item).find('time').text();

                return {
                    title,
                    link,
                    image: '',
                    description: '',
                    date: moment(pubDate, 'MM/DD HH:mm').toDate(),
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
                        item.description = description;
                        item.image = image;

                        //let description = content('article').html();

                        return item;
                    })
            )
        );

        return {
            title: `${title} ${pageName}`,
            link: url,
            items: items,
        };
    }
}
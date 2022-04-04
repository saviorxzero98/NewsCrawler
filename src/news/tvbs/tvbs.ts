import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

import { ServiceContext } from '../../service';
import * as utils from '../../feeds/utils';

const httpClient = axios.default;

const rootUrl = 'https://news.tvbs.com.tw';
const title = 'TVBS新聞';

const categoryMap = {
    realtime: '即時',
    politics: '政治',
    local: '社會',
    world: '全球',
    health: '健康',
    entertainment: '娛樂',
    life: '生活',
    money: '理財房地產',
    china: '大陸',
    tech: '科技',
    focus: 'Focus',
    travel: '食尚',
    fun: '新奇',
    sports: '運動'
}

export class TVBSNewsCrawler {
    private services: ServiceContext;
    constructor(services: ServiceContext) {
        this.services = services;
    }
    
    public async getNews(category: string = '', count: number = 15) {
        let url = '';
        let categoryName = '';
        if (category !== 'realtime') {
            url = `${rootUrl}/realtime/${category}`;
            categoryName = categoryMap[category] || '';
        }
        else {
            url = `${rootUrl}/realtime/`;
            categoryName = categoryMap['realtime'];
        }
        console.log(`GET ${url}`);

        let response = await httpClient.get(url, utils.crawlerOptions);
        let $ = cheerio.load(response.data);
        let list = $('div.news_list div.list ul li')
            .slice(0, count)
            .map((_, item) => {
                let title = $(item).find('a h2').text();
                let link = rootUrl + $(item).find('a').attr('href');
                let image = $(item).find('a img.lazyimage').attr('data-original');

                return {
                    title,
                    link,
                    image,
                    description: '',
                    date: new Date()
                };
            })
            .get()
            .filter(item => item && item.title && item.link);

        let items = await Promise.all(
            list.map(async (item) => 
                this.services
                    .cache
                    .tryGet(item.link, async () => {
                        let detailResponse = await httpClient.get(item.link, utils.crawlerOptions);
                        let content = cheerio.load(detailResponse.data);
                        let description = content('meta[property="og:description"]').attr('content');
                        let pubDate = content('meta[property="article:published_time"]').attr('content');
                        item.description = description;
                        item.date = moment(pubDate, 'YYYY-MM-DDTHH:mm').toDate();

                        //let description = content('div#news_detail_div').html();

                        return item;
                    })
            )
        );

        return {
            title: `${title} ${categoryName}`,
            link: url,
            items: items,
        };
    }
}
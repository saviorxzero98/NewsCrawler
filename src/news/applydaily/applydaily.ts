import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

import { NewsCrawler } from '../newsCrawler';
import { ServiceContext } from '../../service';
import * as utils from '../../feeds/utils';


const httpClient = axios.default;

const rootUrl = 'https://tw.appledaily.com';
const title = '蘋果日報';

const categoryMap = {
    home: '首頁',
    recommend: '焦點',
    new: '最新',
    hot: '熱門',
    life: '生活',
    entertainment: '娛樂',
    local: '社會',
    property: '財經地產',
    international: '國際',
    politics: '政治',
    gadget: '3C車市',
    supplement: '吃喝玩樂',
    sports: '體育',
    forum: '蘋評理',
    micromovie: '微視蘋',
};

export class AppleDailyNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = 'new', count: number = 15) {
        let url = `${rootUrl}/realtime/${category}`;
        console.log(`GET ${url}`);
        let response = await httpClient.get(url, utils.crawlerOptions);
        let $ = cheerio.load(response.data);
        let list = $('div.flex-feature')
            .slice(0, count)
            .map((_, item) => {
                let title = $(item).find('span.headline').text();
                let link = rootUrl + $(item).find('a').attr('href');
                let pubDate = $(item).find('div.timestamp').text();

                return {
                    title,
                    link,
                    image: '',
                    description: '',
                    date: moment(pubDate, 'YYYY/MM/DD HH:mm').toDate()
                };
            })
            .get();

        let items = await this.getDetials(list, async (item, data) => {
            let content = cheerio.load(data);
            let description = content('meta[property="og:description"]').attr('content');
            let image = content('meta[property="og:image"]').attr('content');
            item.description = description;
            item.image = image;
            return item;
        }, utils.crawlerOptions);
         
        return {
            title: `${title} - ${categoryMap[category]}`,
            link: url,
            items: items
        };
    }
}
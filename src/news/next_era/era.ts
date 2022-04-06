import * as moment from 'moment';

import { ServiceContext } from '../../services/service';
import { NewsCrawler } from '../newsCrawler';
import * as utils from '../../feeds/utils';

const rootUrl = 'https://www.eracom.com.tw';
const title = '年代新聞'

const categoryMap = {
    political: '政治',
    LocalNews: '地方',
    Society: '社會',
    Life: '生活',
    WorldNews: '國際',
    Entertainment: '娛樂',
    Sport: '體育',
    Finance: '財經',
    Astro: '命理',
    Art: '藝文',
    Food: '美食'
};

export class ERANewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = 'political', count: number = 15) {
        let url = `${rootUrl}/EraNews/Home/${category}`;
        
        let list = await this.getNewsList({
            url,
            selector: 'div.newslist ul.clearfix li',
            count,
            callback: ($, i) => {
                let title = $(i).find('div.tib-desc p.tib-title').text();
                let link = $(i).find('div.tib-txt a').attr('href');
                let image = $(i).find('div.tib-txt img').attr('src');
                let description = $(i).find('div.tib-desc a.detail-link').text();
                let pubDate = $(i).find('div.tib-desc p.date').text();

                return {
                    title,
                    link,
                    image,
                    description,
                    date: moment(pubDate, 'YYYY-MM-DD HH:mm:ss').toDate(),
                };
            }
        });

        return {
            title: `${title} ${categoryMap[category]}`,
            link: url,
            items: list,
        };
    }
}
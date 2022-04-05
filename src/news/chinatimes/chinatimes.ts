import * as moment from 'moment';

import { ServiceContext } from '../../service';
import { NewsCrawler } from '../newsCrawler';
import * as utils from '../../feeds/utils';

const rootUrl = 'https://www.chinatimes.com';
const title = '中時電子報';

const categoryMap = {
    realtimenews: '即時',
    politic: '政治',
    opinion: '言論',
    life: '生活',
    star: '娛樂',
    money: '財經',
    world: '國際',
    chinese: '兩岸',
    society: '社會',
    armament: '軍事',
    technologynews: '科技',
    sports: '體育',
    hottopic: '網推',
    tube: '有影',
    health: '健康',
    fortune: '運勢',
    taiwan: '寶島'
};

export class ChinaTimesNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }
    
    public async getNews(category: string = 'realtimenews', count: number = 15) {
        let url = `${rootUrl}/${category}/?chdtv`;
        
        let list = await this.getNewsList({
            url,
            options: utils.crawlerOptions,
            selector: 'section.article-list ul div.row',
            count,
            callback: ($, i) => {
                let title = $(i).find('h3.title a').text();
                let link = rootUrl + $(i).find('h3.title a').attr('href');
                let description = $(i).find('p.intro').text();
                let image = $(i).find('img.photo').attr('src');
                let pubDate = $(i).find('time').attr('datetime');

                return {
                    title,
                    link,
                    description,
                    image,
                    date: moment(pubDate, 'HH:mm YYYY/MM/DD').toDate(),
                };
            }
        })
     
        return {
            title: `${title} ${categoryMap[category]}`,
            link: url,
            items: list,
        };
    }
}
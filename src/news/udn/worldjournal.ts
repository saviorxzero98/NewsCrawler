import * as moment from 'moment';

import { crawlerHeaders } from '../../services/httpclient';
import { ServiceContext } from '../../services/service';
import { NewsCrawler } from '../newsCrawler';

const rootUrl = 'https://www.worldjournal.com';
const title = '世界新聞網';

const categoryMap = {
    '0': '即時',
    '121005': '焦點',
    '121006': '美國',
    '121093': '紐約',
    '121094': '洛杉磯',
    '121095': '舊金山',
    '121096': '地方',
    '121010': '中國',
    '121098': '台灣',
    '121099': '國際',
    '121102': '生活',
    '121103': '財經',
    '121007': '娛樂',
    '121008': '運動'
}

export class WorldJournalNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }
    
    public async getNews(category: string = '0', language: string = 'zh-tw', count: number = 15) {
        let url = `${rootUrl}/wj/cate/breaking/${category}`;
        category = (categoryMap[category]) ? category: '0';
        if (language === 'zh-cn') {
            url = `${url}?zh-cn`;
        }

        let crawler = {
            selector: 'div#breaknews div.subcate-list__link',
            callback: ($, i) => {
                let title = $(i).find('h3.subcate-list__link__title').text();
                let link = $(i).find('a').attr('href');
                let image = $(i).find('img').attr('data-src');
                let description = $(i).find('p.subcate-list__link__content').text();
                let pubDate = $(i).find('span.subcate-list__time--roc').text();
                
                return {
                    title,
                    link,
                    description,
                    image,
                    date: moment(pubDate, 'YYYY-MM-DD HH:mm').toDate(),
                };
            }
        };
        let list = await this.getNewsList({
            url,
            options: crawlerHeaders,
            count,
            crawlers: [ crawler ]
        });
            
        return {
            title: `${title} ${categoryMap[category]}`,
            link: url,
            items: list,
        };
    }
}
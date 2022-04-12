import * as moment from 'moment';

import { crawlerHeaders } from '../../services/httpclient';
import { ServiceContext } from '../../services/service';
import { NewsCrawler } from '../newsCrawler';

const rootUrl = 'https://fnc.ebc.net.tw';
const title = '東森財經新聞';

const categoryMap = {
    headline: '焦點',
    video: '影音',
    business: '產業',
    politics: '政治',
    world: '全球',
    stock: '台股',
    house: '房產',
    cars: '汽車',
    money: '理財',
    tech: '3C',
    life: '生活',
    jobs: '職場',
    read: '正能量',
    fashion: '流行時尚',
    else: '其他'
}

export class EBCFncNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = '', count: number = 15) {
        let url = `${rootUrl}/fncnews/${category}`;
        let categoryName = categoryMap[category] ?? '最新';

        let crawler = {
            selector: 'div.fncnews-list-box div.white-box',
            callback: ($, i) => {
                let title = $(i).find('div.text p').text();
                let link = rootUrl + $(i).find('a').attr('href');
                //let image = $(i).find('div.pic div.target-img img').attr('src');
                let pubDate = $(i).find('div.text span.small-gray-text').text();
                
                return {
                    title,
                    link,
                    image: '',
                    description: '',
                    date: moment(pubDate, '(yyyy/MM/DD HH:mm)').toDate(),
                };
            }
        };
        let list = await this.getNewsList({
            url,
            options: crawlerHeaders,
            count,
            crawlers: [ crawler ]
        });

        let items = await this.getNewsDetials({
            list,
            headers: crawlerHeaders,
            callback: (item, content, newsMeta) => {
                item.description = newsMeta.description;
                item.image = newsMeta.image;
                return item;
            }
        });

        return {
            title: `${title} ${categoryName}`,
            link: url,
            items: items,
        };
    }
}
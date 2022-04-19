import * as moment from 'moment';

import { crawlerHeaders } from '../../services/httpclient';
import { ServiceContext } from '../../services/service';
import { NewsCrawler } from '../newsCrawler';


const rootUrl = 'https://news.ebc.net.tw';
const title = '東森新聞';

const categoryMap = {
    realtime: '即時',
    hot: '熱門',
    society: '社會',
    politics: '政治',
    business: '財經',
    car: '汽車',
    star: 'E娛樂',
    world: '國際',
    astrology: '星座',
    comment: 'EBC森談',
    fun: '新奇',
    china: '兩岸',
    house: '房產',
    health: '健康',
    story: '暖聞',
    living: '生活',
    sport: '體育',
    travel: '旅遊'
}

export class EBCNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = 'realtime', count: number = 15) {
        let url = `${rootUrl}/realtime`;
        let categoryName = categoryMap['realtime'];

        category = this.tryGetMapKey(categoryMap, category);
        if (category) {
            categoryName = categoryMap[category];

            if (category === 'realtime' || category === 'hot') {
                url = `${rootUrl}/${category}`;
            }
            else {
                url = `${rootUrl}/news/${category}`;
            }
        }
        
        let crawler = {
            selector: 'div.news-list-box div.white-box',
            callback: ($, i) => {
                let title = $(i).find('div.text span.title').text();
                let link = rootUrl + $(i).find('a').attr('href');
                let image = $(i).find('div.pic div.target-img img').attr('src');
                let description = $(i).find('div.text span.summary').text();
                let pubDate = $(i).find('div.text span.small-gray-text').text();
                
                return {
                    title,
                    link,
                    image,
                    description: description,
                    date: moment(pubDate, 'MM/DD HH:mm').toDate()
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
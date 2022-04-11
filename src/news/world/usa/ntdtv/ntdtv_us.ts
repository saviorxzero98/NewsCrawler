import * as moment from 'moment';

import { crawlerHeaders } from '../../../../services/httpclient';
import { ServiceContext } from '../../../../services/service';
import { NewsCrawler } from '../../../newsCrawler';


const rootUrl = 'https://www.ntdtv.com';
const title = '新唐人電視台';

const categoryMap = {
    'prog202': '國際',
    'prog203': '美國',
    'prog204': '中國',
    'prog205': '港澳',
    'prog206': '台灣',
    'prog207': '評論',
    'prog208': '財經',
    'prog209': '科教',
    'prog210': '娛樂',
    'prog211': '體育',
    'prog212': '海外華人',

    'prog301': '新聞視頻',
    'prog304': '娛樂休閒',
    'prog306': '人文教育',
    'prog308': '評論訪談',
    'prog309': '特別專題',
    'prog310': '影視劇場',

    'prog647': '文史',

    'prog1132': '中國時政',
    'prog1133': '中國財經',
    'prog1134': '中國社會',
    'prog1135': '中國人權',
    'prog1201': '國際時政',
    'prog1202': '國際社會',
    'prog1203': '台灣時政',
    'prog1204': '台灣社會',
    'prog1205': '台灣財經',
    'prog1206': '港台明星',
    'prog1207': '中國明星',
    'prog1208': '日韓明星',
    'prog1209': '歐美明星',
    'prog1210': '亞洲樂壇',
    'prog1211': '歐美樂壇',
    'prog1212': '電視影劇',
    
    'prog1255': '健康',
    'prog1256': '美食',
    'prog1257': '旅遊',

    'prog523905': '美國生活',
    'prog523906': '美國政經',
    'prog523907': '美國華人',
    'prog523908': '美國社會'
}

export class NTDTVUsNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = '', language: string = 'b5', count: number = 15) {
        let url = `${rootUrl}/${language}/headline-news.html`;
        let categoryName = '頭條要聞';
        if (category) {
            url = `${rootUrl}/${language}/${category}`;
        }

        let crawler = {
            selector: 'div.list_wrapper > div',
            callback: ($, i) => {
                let title = $(i).find('div.title').text();
                let link = $(i).find('div.title > a').attr('href');
                let image = $(i).find('img').attr('data-src');
                categoryName = $('h1.block_title').text();

                return {
                    title,
                    link,
                    image: image,
                    description: '',
                    date: new Date()
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
            options: crawlerHeaders,
            callback: (item, content) => {
                let description = content('meta[property="og:description"]').attr('content');
                let pubDate = content('meta[property="article:published_time"]').attr('content');
                item.description += description;
                item.date = moment(pubDate, 'YYYY-MM-DDTHH:mm:ss').toDate();
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
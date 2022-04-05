import * as moment from 'moment';

import { NewsCrawler } from '../newsCrawler';
import { ServiceContext } from '../../service';
import * as utils from '../../feeds/utils';


const rootUrl = 'https://www.mirrormedia.mg';
const title = '鏡周刊';

const sectionMap = {
    'news': '時事',
    'businessmoney': '理財財經',
    'entertainment': '娛樂',
    'international': '國際',
    'mafalda': '瑪法達',
    'culture': '文化',
    'carandwatch': '汽車鐘錶'
}
const categoryMap = {
    'news': '焦點',
    'political': '政治',
    'city-news': '社會',
    'life': '生活',
    'boom': '鏡爆',
    'wine1': '微醺酪品',

    'business': '財經',

    'latestnews': '娛樂頭條',
    'rookie': '試鏡間',
    'fashion': '穿衣鏡',
    'madam': '蘭蘭夫人',
    'superstar': '我眼中的大明星',
    'insight': '娛樂透視',
    'comic': '動漫遊戲',
    
    'global': '國際要聞',

    'bookreview': '書評',
    'culture-column': '專欄',
    'poem': '詩',
    'knowledgeprogram': '知識好好玩',
    'booksummary': '鏡書摘',
    'voice': '好聽人物',

    'car_focus': '車壇焦點',
    'car_features': '鏡車專題',
    'test_drives': '靚俥試駕',
    'pit_zone': '鏡車經',
    'watchfocus': '錶壇焦點',
    'watchfeature': '鐘錶專題',
    'blog': '編輯幕後',
    'NewWatches2021': '新錶2021',
    'luxury': '奢華誌',
    'NewWatches2022': '新錶2022'
}

export class MirrorMediaNewsCrawler  extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(section: string = 'news', category: string = '', count: number = 25) {
        let url = '';
        let pageName = '';
        if (category) {
            url = `${rootUrl}/category/${category}`;
            pageName = categoryMap[category];
        }
        else {
            url = `${rootUrl}/section/${section}`;
            pageName = sectionMap[section];
        }

        let list = await this.getNewsList({
            url,
            options: utils.crawlerOptions,
            selector: 'section.article-list li.list__list-item',
            count,
            callback: ($, i) => {
                let title = $(i).find('div.article__bottom-wrapper h1').text();
                let link = rootUrl + $(i).find('a').attr('href');
                //let image = rootUrl + $(i).find('div.article__top-wrapper img').attr('data-src');
                //let description = $(i).find('div.article__bottom-wrapper p').text();
                //let pubDate = $(i).find('div.ti_left time').text();

                return {
                    title,
                    link,
                    image: '',
                    description: '',
                    date: new Date(),
                };
            }
        });

        let items = await this.getNewsDetials({
            list,
            options: utils.crawlerOptions,
            callback: (item, content) => {
                let description = content('meta[property="og:description"]').attr('content');
                let image = content('meta[property="og:image"]').attr('content');
                let pubDate = content('meta[property="article:published_time"]').attr('content');
                item.description = description;
                item.image = image;
                item.date =  moment(pubDate, 'YYYY-MM-DDTHH:mm').toDate();
                return item;
            }
        })
            
        return {
            title: `${title} ${pageName}`,
            link: url,
            items: items
        };
    }
}
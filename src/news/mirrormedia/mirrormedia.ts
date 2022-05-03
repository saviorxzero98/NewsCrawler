import { crawlerHeaders } from '../../services/httpclient';
import { NewsCrawler } from '../newsCrawler';
import { ServiceContext } from '../../services/service';


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

    public async getNewsBySection(section: string = 'news', count: number = 15) {
        let url = `${rootUrl}/section/news`;
        let sectionName = sectionMap['news'];

        section = this.tryGetMapKey(sectionMap, section);
        if (section && sectionMap[section]) {
            url = `${rootUrl}/section/${section}`;
            sectionName = sectionMap[section];
        }

        return await this.getNews(url, sectionName, count);
    }

    public async getNewsByCategory(category: string = 'news', count: number = 15) {
        let url = `${rootUrl}/category/news`;
        let categoryName = categoryMap['news'];

        category = this.tryGetMapKey(categoryMap, category);
        if (category && categoryMap[category]) {
            url = `${rootUrl}/category/${category}`;
            categoryName = categoryMap[category];
        }

        return await this.getNews(url, categoryName, count);
    }

    private async getNews(url: string, pageName: string, count: number = 15) {
        let crawler = {
            selector: 'section.article-list li.list__list-item',
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
                item.image = newsMeta.image ?? item.image;
                item.date =  newsMeta.pubDate;
                return item;
            }
        });
            
        return {
            title: `${title} ${pageName}`,
            link: url,
            items: items
        };
    }
}
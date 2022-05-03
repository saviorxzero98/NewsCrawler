import { crawlerHeaders } from '../../services/httpclient';
import { NewsCrawler } from '../newsCrawler';
import { ServiceContext } from '../../services/service';


const rootUrl = 'https://www.mnews.tw';
const title = '鏡新聞';

const categoryMap = {
    'pol': '政治',
    'int': '國際',
    'fin': '財經',
    'soc': '社會',
    'lif': '生活',
    'unc': '內幕',
    'ent': '娛樂'
}

export class MNewsNewsCrawler  extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = 'pol', count: number = 15) {
        let url = '';
        let categoryName = '';

        category = this.tryGetMapKey(categoryMap, category);
        if (category) {
            url = `${rootUrl}/category/${category}`;
            categoryName = categoryMap[category];
        }
        else {
            url = `${rootUrl}/category/pol`;
            categoryName = categoryMap['pol'];
        }

        
        let crawler = {
            selector: 'ol.list-latest li',
            callback: ($, i) => {
                let title = $(i).find('span.article-title').text();
                let image = $(i).find('img.article-img').attr('data-src');
                let link = rootUrl + $(i).find('a.article-card').attr('href');
                let pubDate = $(i).find('span.article-date').text();

                return {
                    title,
                    link,
                    image,
                    description: '',
                    date: new Date(pubDate),
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
            items: items
        };
    }

    public async getNewsByTag(tag: string = '', count: number = 15) {
        let url = '';

        if (tag) {
            url = `${rootUrl}/tag/${encodeURIComponent(tag)}`;
        }
        else {
            return await this.getNews('pol', count);
        }


        let crawler = {
            selector: 'ol.tag__list li',
            callback: ($, i) => {
                let title = $(i).find('span.article-title').text();
                let image = $(i).find('img.article-img').attr('data-src');
                let link = rootUrl + $(i).find('a.article-card').attr('href');
                let pubDate = $(i).find('span.article-date').text();

                return {
                    title,
                    link,
                    image,
                    description: '',
                    date: new Date(pubDate),
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
            title: `${title} ${tag}`,
            link: url,
            items: items
        };
    }
}
import { crawlerHeaders } from '../../../services/httpclient';
import { ServiceContext } from '../../../services/service';
import { NewsCrawler } from '../../newsCrawler';


const rootUrl = 'https://www.top1health.com';
const title = '華人健康網';

export class Top1HealthNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = 'Recent', subcategory: string = '', count: number = 15) {
        if (category) {
            switch (category.toLowerCase()) {
                case 'recent':
                case 'hot':
                    return await this.getRecentOrHotNews(category, count);

                default:
                    return await this.getNewsByCategory(category, subcategory, count);
            }
        }
        return await this.getRecentOrHotNews('Recent', count);
    }

    public async getRecentOrHotNews(category: string = 'Recent', count: number = 15) {
        let url = `${rootUrl}`;
        let categoryName = '';

        if (category && category.toLowerCase() === 'hot') {
            url = `${url}/Hot`;
            categoryName = '熱門';
        }
        else {
            url = `${url}/Recent`;
            categoryName = '最新';
        }

        let crawlers = [
            {
                selector: 'div.content ul.topic-list li',
                callback: ($, i) => {
                    let title = $(i).find('h3 a').text();
                    let link = rootUrl + $(i).find('a').attr('href');
                    let description = ($(i).find('p').text() || '').replace('詳全文', '').trim();

                    return {
                        title,
                        link,
                        image: '',
                        description,
                        date: new Date(),
                    };
                }
            }
        ]
        let list = await this.getNewsList({
            url,
            options: crawlerHeaders,
            count,
            crawlers: crawlers
        });

        let items = await this.getNewsDetials({
            list,
            headers: crawlerHeaders,
            callback: (item, content, newsMeta) => {
                item.description = content('meta[name="description"]').attr('content') || item.description;
                item.image = newsMeta.image;
                let pubDate = content('span[itemprop="datePublished"]').attr('content');
                item.date = new Date(pubDate);
                return item;
            }
        });
    
        return {
            title: `${title} ${categoryName}`,
            link: url,
            items: items
        };
    }

    public async getNewsByCategory(category: string = 'Recent', subcategory: string = '', count: number = 15) {
        let url = `${rootUrl}`;
        let categoryName = '';

        if (category) {
            url = `${url}/Category/${encodeURIComponent(category)}`;
            categoryName = category;

            if (subcategory) {
                url = `${url}/${encodeURIComponent(subcategory)}`;
                categoryName = subcategory;
            }
        }

        let crawlers = [
            {
                selector: 'div.content ul.topic-list li',
                callback: ($, i) => {
                    let title = $(i).find('a.topic').text();
                    let link = rootUrl + $(i).find('a').attr('href');
                    let description = ($(i).find('p').text() || '').replace('詳全文', '').trim();

                    return {
                        title,
                        link,
                        image: '',
                        description,
                        date: new Date(),
                    };
                }
            }
        ]
        let list = await this.getNewsList({
            url,
            options: crawlerHeaders,
            count,
            crawlers: crawlers
        });

        let items = await this.getNewsDetials({
            list,
            headers: crawlerHeaders,
            callback: (item, content, newsMeta) => {
                item.description = content('meta[name="description"]').attr('content') || item.description;
                item.image = newsMeta.image;
                let pubDate = content('span[itemprop="datePublished"]').attr('content');
                item.date = new Date(pubDate);
                return item;
            }
        });
    
        return {
            title: `${title} ${categoryName}`,
            link: url,
            items: items
        };
    }
}
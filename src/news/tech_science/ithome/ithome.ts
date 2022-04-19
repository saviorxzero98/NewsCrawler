import { crawlerHeaders } from '../../../services/httpclient';
import { ServiceContext } from '../../../services/service';
import { NewsCrawler } from '../../newsCrawler';


const rootUrl = 'https://www.ithome.com.tw';
const title = 'iThome';

const categoryMap = {
    'news': '新聞',
    'tech': '產品&技術',
    'feature': '專題',
    'big-data': 'AI',
    'cloud': 'Cloud',
    'devops': 'DevOps',
    'security': '資安',
    'zerotrust': '零信任資安講堂'
}

export class IThomeNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }
    
    public async getNews(count: number = 15) {
        let url = `${rootUrl}/rss`;

        let { list, title } = await this.getNewsListFromRSS({
            url,
            count
        });
        
        let items = await this.getNewsDetials({
            list,
            headers: crawlerHeaders,
            callback: (item, content, newsMeta) => {
                item.image = newsMeta.image;
                return item;
            }
        });

        return {
            title: `${title}`,
            link: rootUrl,
            items: items
        };
    }

    public async getNewsByCategory(category: string = 'news', count: number = 15) {      
        let url = `${rootUrl}/news`;
        let categoryName = categoryMap['news'];
        
        category = this.tryGetMapKey(categoryMap, category);
        if (category && categoryMap[category]) {
            url = `${rootUrl}/${category}`;
            categoryName = categoryMap[category];
        }
        else {
            return await this.getNews(count);
        }

        let crawlers = [];

        if (category === 'zerotrust') {
            url = `${rootUrl}/zerotrust/news`;
            crawlers = [
                {
                    selector: 'div.zt-news-item article',
                    callback: ($, i) => {
                        let title = $(i).find('h2 a').text();
                        let link = rootUrl + $(i).find('h2 a').attr('href');
                        let image = $(i).find('img').attr('src');
                        let description = $(i).find('div.field-type-text-with-summary p').text();
                        let pubDate = $(i).find('span.created').text();
                        
                        return {
                            title,
                            link,
                            image,
                            description: description,
                            date: new Date(pubDate)
                        };
                    }
                }
            ]
        }
        else {
            crawlers = [
                {
                    selector: 'div.channel-headline',
                    callback: ($, i) => {
                        let title = $(i).find('div.title a').text();
                        let link = rootUrl + $(i).find('div.title a').attr('href');
                        let image = $(i).find('img').attr('src');
                        let description = $(i).find('div.summary').text();
                        
                        return {
                            title,
                            link,
                            image,
                            description: description,
                            date: new Date()
                        };
                    }
                },
                {
                    selector: 'div.channel-item span.field-content',
                    callback: ($, i) => {
                        let title = $(i).find('p.title a').text();
                        let link = rootUrl + $(i).find('p.title a').attr('href');
                        let image = $(i).find('img').attr('src');
                        let description = $(i).find('div.summary').text();
                        let pubDate = $(i).find('p.post-at').text();
                        
                        return {
                            title,
                            link,
                            image,
                            description: description,
                            date: new Date(pubDate)
                        };
                    }
                }
            ];
        }

        
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
                item.image = newsMeta.image;

                let pubDate = content('span.created').text();
                item.date = new Date(pubDate);

                return item;
            }
        });

        return {
            title: `${title} ${categoryName}`,
            link: rootUrl,
            items: items
        };
    }
}
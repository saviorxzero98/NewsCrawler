import { crawlerHeaders } from '../../../services/httpclient';
import { ServiceContext } from '../../../services/service';
import { NewsCrawler } from '../../newsCrawler';


const rootUrl = 'https://helloyishi.com.tw';
const title = 'Hello醫師';

export class HelloYishiNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = '', subcategory: string = '', count: number = 15) {
        let url = `${rootUrl}`;
        let categoryName = '';

        if (category) {
            url = `${url}/${category}`;

            if (subcategory) {
                url = `${url}/${subcategory}`;
            }
        }


        let crawlers = [
            {
                selector: 'article.article-card',
                callback: ($, i) => {
                    categoryName = $('div.category-name').text();
                    let title = $(i).find('div.inner-content div.title').text();
                    let link = rootUrl + $(i).find('div.banner a').attr('href');
                    let image = $(i).find('img').attr('src') || '';

                    return {
                        title,
                        link,
                        image,
                        description: '',
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
                item.description = newsMeta.description;
                item.date = new Date(newsMeta.pubDate);
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
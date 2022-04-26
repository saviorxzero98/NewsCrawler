import { crawlerHeaders } from '../../../services/httpclient';
import { ServiceContext } from '../../../services/service';
import { NewsCrawler } from '../../newsCrawler';


const rootUrl = 'https://www.natgeomedia.com';
const title = '國家地理頻道';

const categoryMap = {
    'science': '科學與新知',
    'environment': '環保與保育',
    'history': '歷史與文化',
    'explore': '探索與冒險',
    'travel': '旅遊',
    'special_projects': '主題企劃'
}

export class NatgeoMediaNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = '', count: number = 15) {
        let url = `${rootUrl}`;
        let categoryName = this.tryGetMapValue(categoryMap, category) ?? '';
       
        if (category && categoryName) {
            url = `${rootUrl}/${category}`;
        }        

        let crawlers = [
            {
                selector: 'div.art-btn-la-content, div.art-btn-s-content, div.art-btn-mh-content',
                callback: ($, i) => {
                    let title = $(i).find('img').attr('alt');
                    let link = $(i).find('a').attr('href');
                    let image = $(i).find('img').attr('src');
                    let pubDate = $(i).find('h6').text();

                    return {
                        title,
                        link,
                        image: image,
                        description: '',
                        date: new Date(pubDate),
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

                //let description = content('article').html();
                //item.description = description;

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





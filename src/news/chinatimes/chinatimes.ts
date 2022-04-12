import { crawlerHeaders } from '../../services/httpclient';
import { ServiceContext } from '../../services/service';
import { NewsCrawler } from '../newsCrawler';

const rootUrl = 'https://www.chinatimes.com';
const title = '中時電子報';

const categoryMap = {
    'realtimenews': '即時',
    'politic': '政治',
    'opinion': '言論',
    'life': '生活',
    'star': '娛樂',
    'money': '財經',
    'world': '國際',
    'chinese': '兩岸',
    'society': '社會',
    'armament': '軍事',
    'sports': '體育',
    'hottopic': '網推',
    'tube': '有影',
    'health': '健康',
    'fortune': '運勢',
    'taiwan': '寶島',
    'technologynews': '科技',
};

export class ChinaTimesNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }
    
    public async getNews(category: string = 'realtimenews', subcategory: string = '', count: number = 15) {
        let url = `${rootUrl}/realtimenews/?chdtv`;
        let categoryName = '';
        if (category) {
            categoryName = categoryMap[category];

            if (subcategory) {
                url = `${rootUrl}/${category}/${subcategory}/?chdtv`;
            }
            else {
                url = `${rootUrl}/${category}/?chdtv`; 
            }
        }

        let crawler = {
            selector: 'section.article-list ul div.row',
            callback: ($, i) => {
                let title = $(i).find('h3.title a').text();
                let link = rootUrl + $(i).find('h3.title a').attr('href');
                let description = $(i).find('p.intro').text();
                let image = $(i).find('img.photo').attr('src') || '';
                let pubDate = $(i).find('time').attr('datetime');
                return {
                    title,
                    link,
                    description,
                    image,
                    date: new Date(pubDate)
                };
            }
        };
        let list = await this.getNewsList({
            url,
            options: crawlerHeaders,
            count,
            crawlers: [ crawler ]
        })
        
        

        return {
            title: `${title} ${categoryName}`,
            link: url,
            items: list,
        };
    }
}
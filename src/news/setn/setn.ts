import * as moment from 'moment';

import { ServiceContext } from '../../services/service';
import * as utils from '../../feeds/utils';
import { NewsCrawler } from '../newsCrawler';

const rootUrl = 'https://www.setn.com';
const title = '三立新聞';

const pageMap = {
    '0': '熱門',
    '2': '財經',
    '4': '生活',
    '5': '國際',
    '6': '政治',
    '7': '科技',
    '9': '名家',
    '12': '汽車',
    '31': 'HOT焦點',
    '34': '運動',
    '41': '社會',
    '42': '新奇',
    '47': '寵物',
    '65': '健康',
    '97': '地方'
}

export class SETNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }
    
    public async getNews(page: string = '', count: number = 15) {
        let url = `${rootUrl}/ViewAll.aspx`;
        let pageName = '即時';
        if (page && /^\d+$/.test(page)) {
            url = `${url}?PageGroupID=${page}`;
            pageName = pageMap[page];
        }

        let crawler = {
            selector: 'div.newsItems',
            callback: ($, i) => {
                let title = $(i).find('a.gt').text();
                let link = $(i).find('a.gt').attr('href');
                if (!link.startsWith('https:')) {
                    link = rootUrl + link;
                }
                let pubDate = $(i).find('time').text();

                return {
                    title,
                    link,
                    image: '',
                    description: '',
                    date: moment(pubDate, 'MM/DD HH:mm').toDate(),
                };
            }
        };
        let list = await this.getNewsList({
            url,
            options: utils.crawlerOptions,
            count,
            crawlers: [ crawler ]
        });
        
        let items = await this.getNewsDetials({
            list,
            options: utils.crawlerOptions,
            callback: (item, content) => {
                let description = content('meta[property="og:description"]').attr('content');
                let image = content('meta[property="og:image"]').attr('content');
                item.description = description;
                item.image = image;

                //let description = content('article').html();

                return item;
            }
        });

        return {
            title: `${title} ${pageName}`,
            link: url,
            items: items,
        };
    }
}
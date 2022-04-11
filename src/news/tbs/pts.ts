import * as moment from 'moment';


import { crawlerHeaders } from '../../services/httpclient';
import { ServiceContext } from '../../services/service';
import { NewsCrawler } from '../newsCrawler';

const rootUrl = 'https://news.pts.org.tw';
const title = '公視新聞';

const categoryMap = {
    'dailynews': '即時',
    'opinion': '觀點',
    'report': '深度報導',

    '1': '政治',
    '2': '政經',
    '3': '環境',
    '4': '全球',
    '5': '生活',
    '6': '文教科技',
    '7': '社會',
    '9': '兩岸',
    '10': '產經',
    '11': '地方',
    '12': '社福人權'
}

export class PTSNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category ?: string, count: number = 15) {
        let url = `${rootUrl}/dailynews`;
        let categoryName = '即時';

        if (category && categoryMap[category]) {
            if (/^\d+$/.test(category)) {
                url = `${rootUrl}/category/${category}`;
                categoryName = categoryMap[category];
            }
            else {
                url = `${rootUrl}/${category}`;
                categoryName = categoryMap[category];
            }
        }

        let crawlers = [
            this.getTopNewsCrawler(),
            this.getNextNewsCrawler()
        ];
        let list = await this.getNewsList({
            url,
            options: crawlerHeaders,
            count,
            crawlers: crawlers
        });

        let items = await this.getNewsDetials({
            list,
            options: crawlerHeaders,
            callback: (item, content) => {
                let description = content('meta[property="og:description"]').attr('content');
                let image = content('meta[property="og:image"]').attr('content');
                item.description = description;
                item.image = image;
                return item;
            }
        });
        
        return {
            title: `${title} ${categoryName}`,
            link: url,
            items: items,
        };
    }

    private getTopNewsCrawler() {
        let crawler = {
            selector: 'div.breakingnews',
            callback: ($, i) => {
                let title = $(i).find('h2 a').text();
                let link = $(i).find('h2 a').attr('href');
                let image = $(i).find('img').attr('src');
                let pubDate = $(i).find('div.news-info time').attr('datetime');

                return {
                    title,
                    link,
                    image: image,
                    description: '',
                    date: moment(pubDate, 'YYYY-MM-DD HH:mm:ss').toDate(),
                };
            }
        };
        return crawler;
    }

    private getNextNewsCrawler() {
        let crawler = {
            selector: 'ul.news-list li.d-flex',
            callback: ($, i) => {
                let title = $(i).find('h2 a').text();
                let link = $(i).find('h2 a').attr('href');
                let image = $(i).find('img').attr('src');
                let pubDate = $(i).find('div.news-info time').attr('datetime');

                return {
                    title,
                    link,
                    image: image,
                    description: '',
                    date: moment(pubDate, 'YYYY-MM-DD HH:mm:ss').toDate(),
                };
            }
        };
        return crawler;
    }
}
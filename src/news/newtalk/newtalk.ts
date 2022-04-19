import { HttpClient, crawlerHeaders } from '../../services/httpclient';
import { ServiceContext } from '../../services/service';
import { NewsCrawler } from '../newsCrawler';


const rootUrl = 'https://newtalk.tw';
const title = '新頭殼 Newtalk';

const categoryMap = {
    '1': '國際',
    '2': '政治',
    '3': '財經',
    '4': '司法',
    '5': '生活',
    '6': '創夢',
    '7': '中國',
    '8': '科技',
    '9': '環保',
    '10': '電競',
    '11': '藝文',
    '13': '選舉',
    '14': '社會',
    '15': '旅遊',
    '16': '美食',
    '17': '遊戲',
    '18': '娛樂',
    '19': '專欄',
    '101': '中央社',
    '102': '體育',
    '103': '新奇',
    '106': '網紅',
    'topics': '議題'
}

export class NewtalkNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }
    
    public async getNews(category: string = '', topic: string = '', count: number = 15) {
        let url = `${rootUrl}/news/summary/today`;
        let categoryName = '總覽';
        if (category) {
            if (category.toLowerCase() === 'topics' &&
                topic &&
                /^\d+$/.test(topic)) {
                categoryName = categoryMap['topics'] || '';
                url = `${rootUrl}/news/topics/view/${topic}`;
            }
            else if (/^\d+$/.test(category) &&
                     categoryMap[category]) {
                categoryName = categoryMap['category'] || '';
                url = `${rootUrl}/news/subcategory/${category}`;
            }
        }
        
        let crawlers = [
            this.getTopNewsCrawler(),
            this.getNextNewsCrawler()
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
                item.image = newsMeta.image ?? item.image;
                item.date = newsMeta.pubDate;

                //let description = content('div.news-content').html();

                return item;
            }
        });
            
        return {
            title: `${title} ${categoryName}`,
            link: url,
            items: items
        };
    }


    private getTopNewsCrawler() {
        let crawler = {
            selector: 'div.news-top2 div.newsArea',
            callback: ($, i) => {
                let title = $(i).find('div.news-title a').text();
                let link = $(i).find('a').attr('href');
                //let image = $(i).find('div.news-img img').attr('src');

                return {
                    title,
                    link,
                    image: '',
                    description: '',
                    date: new Date(),
                };
            }
        };
        return crawler;
    }

    private getNextNewsCrawler() {
        let crawler = {
            selector: 'div.news-list div.news-list-item',
            callback: ($, i) => {
                let title = $(i).find('div.news_title').text();
                title = title.replace('\n', '').trim();
                let link = $(i).find('a').attr('href');
                //let image = $(i).find('div.news_img img').attr('src');
                //let description = $(i).find('div.news_text a').text();

                return {
                    title,
                    link,
                    image: '',
                    description: '',
                    date: new Date(),
                };
            }
        };
        return crawler;
    }
}
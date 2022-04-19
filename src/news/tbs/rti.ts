import { crawlerHeaders } from '../../services/httpclient';
import { ServiceContext } from '../../services/service';
import { NewsCrawler } from '../newsCrawler';

const rootUrl = 'https://www.rti.org.tw';
const title = 'Rti 中央廣播電台';

const categoryMap = {
    '1': '國際',
    '2': '財經',
    '3': '生活',
    '4': '兩岸',
    '5': '政治',
    '6': '專題'
};

export class RtiNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = '', count: number = 15) {
        let url = `${rootUrl}/news/list`;
        let categoryName = '總覽'
        if (category && /^\d$/.test(category) && categoryMap[category]) {
            url = `${rootUrl}/news/list/categoryId/${category}`;
            categoryName = categoryMap[category];
        }

        let items = await this.getNewsItems(url, count);

        return {
            title: `${title} ${categoryName}`,
            link: url,
            items: items,
        };
    }

    public async getNewsByTag(tag: string = '', count: number = 15) {
        if (tag) {
            let url = `${rootUrl}/news/list/tag/${encodeURIComponent(tag)}`;

            let items = await this.getNewsItems(url, count);

            return {
                title: `${title} ${tag}`,
                link: url,
                items: items,
            };
        }
        else {
            return await this.getNews('', count);
        }
    }

    private async getNewsItems(url: string, count: number = 15) {
        let crawler = {
            selector: 'section.newslist-box ul li',
            callback: ($, i) => {
                let title = $(i).find('span.title').text();
                let link = rootUrl + $(i).find('a').attr('href');

                return {
                    title,
                    link,
                    image: '',
                    description: '',
                    date: new Date()
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

                let pubDate = content('section.news-detail-box li.date').text();
                pubDate = this.parsePubDate(pubDate);
                item.date = new Date(pubDate);

                //let description = content('article').html();

                return item;
            }
        });

        return items;
    }

    private parsePubDate(text: string): string {
        // YYYY-MM-DD HH:mm:ss
        const pattern = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/g;
        let matchList = text.match(pattern);

        if (matchList.length != 0) {
            return matchList[0];
        }
        return '';
    }
}
import { crawlerHeaders } from '../../services/httpclient';
import { NewsCrawler } from '../newsCrawler';
import { ServiceContext } from '../../services/service';

const rootUrl = 'http://new.ctv.com.tw';
const title = '中視新聞';

export class CTVNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = '生活', count: number = 15) {
        category = category ?? '生活'
        let url = `${rootUrl}/Category/${encodeURIComponent(category)}`;

        let crawler = {
            selector: 'div.search_result div.list a',
            callback: ($, i) => {
                let title = $(i).find('div.title').text();
                title = title.split('│')[0];
                let link = rootUrl + $(i).attr('href');
                let description = $(i).find('div.brief').text();
                let image = $(i).find('img').attr('src') || '';
                let pubDate = $(i).find('div.time').text().trim();
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
            title: `${title} ${category}`,
            link: url,
            items: list,
        };
    }


    public async getRSSNews(count: number = 15) {
        let url = `${rootUrl}/rss`;

        let { list } = await this.getNewsListFromRSS({
            url,
            count,
            callback: (item) => {
                item.title = item.title.split('│')[0];
                item.content = item.summary;

                let link: string = item.id;
                link = link.replace(`${rootUrl}/Article`, '');
                link = encodeURIComponent(link);
                item.link = `${rootUrl}/Article/${link}`;
                
                return item;
            }
        })

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
            title: `${title}`,
            link: url,
            items: items
        };
    }
}
import { crawlerHeaders, HttpClient } from '../../../../services/httpclient';
import { ServiceContext } from '../../../../services/service';
import { NewsCrawler } from '../../../newsCrawler';

const rootUrl = 'https://chinese.aljazeera.net';
const title = 'Aljazeera半岛网';

export class AljazeeraCNNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = 'news', count: number = 15) {
        let url = `${rootUrl}/${category}`;

        let crawler = {
            selector: 'h3 a',
            callback: ($, i) => {
                let title = $(i).text();
                let link = rootUrl + $(i).attr('href');

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
            callback: (item, content, newsMeta, response) => {
                item.description = newsMeta.description;
                item.image = newsMeta.image;

                let pubDate = response.data.match(/"datePublished": "(.*?)",/)[1];
                item.date = new Date(pubDate);

                return item;
            }
        });

        return {
            title: `${title}`,
            link: url,
            items: items,
        };
    }
}
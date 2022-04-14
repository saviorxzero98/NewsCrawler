import { crawlerHeaders } from '../../../../services/httpclient';
import { ServiceContext } from '../../../../services/service';
import { NewsCrawler } from '../../../newsCrawler';

const rootUrl = 'https://news.now.com';
const title = 'NOW新聞';

const categoryMap = {
    tracker: 123,
    feature: 124,
    opinion: 125,
};

export class NowNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = '', id: string = '', count: number = 15) {
        let url = `${rootUrl}/home`;

        if (categoryMap[category]) {
            url = `${rootUrl}/home/${category}/detail?catCode=${categoryMap[category]}&topicId=${id}`;
        }
        else {
            if (category) {
                url = `${rootUrl}/home/${category}`;
            }
        }

        let crawler = {
            selector: `${category === '' ? '.homeFeaturedNews ' : '.newsCategoryColLeft '}.newsTitle`,
            callback: ($, i) => {
                let title = $(i).text();
                let link = rootUrl + $(i).parent().parent().attr('href');
                
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

                let pubDate = content('.published').attr('datetime');
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
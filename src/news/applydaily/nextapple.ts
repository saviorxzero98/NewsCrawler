import { crawlerHeaders } from '../../services/httpclient';
import { NewsCrawler } from '../newsCrawler';
import { ServiceContext } from '../../services/service';

const rootUrl = 'https://tw.nextapple.com';
const title = '壹蘋新聞網';

const categoryMap = {
    latest: '最新',
    recommend: '焦點',
    hit: '熱門',
    entertainment: '娛樂',
    life: '生活',
    gorgeous: '女神',
    local: '社會',
    politics: '政治',
    international: '國際',
    finance: '財經',
    blockchain: '區塊鏈',
    property: '房市',
    fashion: '時尚',
    sports: '體育',
    lifestyle: '旅遊美食',
    auto: '車市',
    health: '健康',
    gadget: '3C',
    forum: '蘋理'
}

export class NextAppleNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = 'latest', count: number = 15) {
        let url = `${rootUrl}/realtime/${category}`;
        let categoryName = '最新';

        category = this.tryGetMapKey(categoryMap, category);
        if (category && categoryMap[category]) {
            url = `${rootUrl}/realtime/${category}`;
            categoryName = categoryMap[category];
        }
        url = `${url}/`;

        let crawler = {
            selector: 'article.post-style3',
            callback: ($, i) => {
                let title = $(i).find('a.post-title').text();
                let link = $(i).find('a').attr('href');
                let image = $(i).find('img').attr('src');
                let description = $(i).find('div.post-inner p').text();
                let pubDate = $(i).find('div.post-meta time').attr('datetime');

                return {
                    title,
                    link,
                    image,
                    description,
                    date: new Date(pubDate)
                };
            }
        };
        let list = await this.getNewsList({
            url,
            options: crawlerHeaders,
            count,
            crawlers: [ crawler ]
        });

        // let items = await this.getNewsDetials({
        //     list,
        //     headers: crawlerHeaders,
        //     callback: (item, content, newsMeta) => {
        //         item.description = newsMeta.description;
        //         item.image = newsMeta.image ?? item.image;
        //         return item;
        //     }
        // });
         
        return {
            title: `${title} ${categoryName}`,
            link: url,
            items: list
        };
    }
}
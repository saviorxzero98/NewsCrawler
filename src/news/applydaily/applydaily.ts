import { crawlerHeaders } from '../../services/httpclient';
import { NewsCrawler } from '../newsCrawler';
import { ServiceContext } from '../../services/service';

const rootUrl = 'https://tw.appledaily.com';
const title = '蘋果日報';

const categoryMap = {
    home: '首頁',
    recommend: '焦點',
    new: '最新',
    hot: '熱門',
    life: '生活',
    entertainment: '娛樂',
    local: '社會',
    property: '財經地產',
    international: '國際',
    politics: '政治',
    gadget: '3C車市',
    supplement: '吃喝玩樂',
    sports: '體育',
    forum: '蘋評理',
    micromovie: '微視蘋',
};

export class AppleDailyNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = 'new', count: number = 15) {
        let url = `${rootUrl}/realtime/${category}`;
        let categoryName = '最新';

        category = this.tryGetMapKey(categoryMap, category);
        if (category && categoryMap[category]) {
            url = `${rootUrl}/realtime/${category}`;
            categoryName = categoryMap[category];
        }
        url = `${url}/`;

        let crawler = {
            selector: 'div#section-body div.flex-feature',
            callback: ($, i) => {
                let title = $(i).find('span.headline').text();
                let link = $(i).find('a').attr('href');
                let pubDate = $(i).find('div.timestamp').text();

                return {
                    title,
                    link,
                    image: '',
                    description: '',
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

        let items = await this.getNewsDetials({
            list,
            headers: crawlerHeaders,
            callback: (item, content, newsMeta) => {
                item.description = newsMeta.description;
                item.image = newsMeta.image ?? item.image;
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
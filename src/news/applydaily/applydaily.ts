import * as moment from 'moment';

import { NewsCrawler } from '../newsCrawler';
import { ServiceContext } from '../../services/service';
import * as utils from '../../feeds/utils';

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

        let list = await this.getNewsList({
            url,
            options: utils.crawlerOptions,
            selector: 'div.flex-feature',
            count,
            callback: ($, i) => {
                let title = $(i).find('span.headline').text();
                let link = rootUrl + $(i).find('a').attr('href');
                let pubDate = $(i).find('div.timestamp').text();

                return {
                    title,
                    link,
                    image: '',
                    description: '',
                    date: moment(pubDate, 'YYYY/MM/DD HH:mm').toDate()
                };
            }
        });

        let items = await this.getNewsDetials({
            list,
            options: utils.crawlerOptions,
            callback: (item, content) => {
                let description = content('meta[property="og:description"]').attr('content');
                let image = content('meta[property="og:image"]').attr('content');
                item.description = description;
                item.image = image;
                return item;
            }
        });
         
        return {
            title: `${title} ${categoryMap[category]}`,
            link: url,
            items: items
        };
    }
}
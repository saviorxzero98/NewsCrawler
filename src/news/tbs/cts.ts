import * as moment from 'moment';

import { ServiceContext } from '../../services/service';
import * as utils from '../../feeds/utils';
import { NewsCrawler } from '../newsCrawler';

const rootUrl = 'https://news.cts.com.tw';
const title = '華視新聞';

const channelMap = {
    real: '即時',
    weather: '氣象',
    politics: '政治',
    international: '國際',
    society: '社會',
    sports: '運動',
    life: '生活',
    money: '財經',
    local: '地方',
    general: '綜合',
    arts: '藝文',
    entertain: '娛樂'
};

export class CTSNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(page: string = 'real', count: number = 15) {
        let url = `${rootUrl}/${page}/index.html`;
        
        let list = await this.getNewsList({
            url,
            options: utils.crawlerOptions,
            selector: 'div.newslist-container a',
            count,
            callback: ($, i) => {
                let pubDate = moment($(i).find('p.newstitle span.newstime').text(), 'yyyy/MM/DD HH:mm').format('yyyy-MM-DD HH:mm');
                $(i).find('p.newstitle span.newstime').remove();
                let title = $(i).find('p.newstitle').text();
                //let image = $(i).find('div.newsimg-thumb img').attr('src');
                let link = $(i).attr('href');

                return {
                    title,
                    link,
                    image: '',
                    description: '',
                    date: moment(pubDate, 'YYYY/MM/DD HH:mm').toDate(),
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

                //content('div.artical-content div.cts-tbfs').remove();
                //content('div.artical-content p.news-src').remove();
                //let description = content('div.artical-content').html();
                
                return item;
            }
        });
        
        return {
            title: `${title} ${channelMap[page]}`,
            link: url,
            items: items,
        };
    }
}
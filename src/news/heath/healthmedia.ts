import * as moment from 'moment';

import { ServiceContext } from '../../service';
import { NewsCrawler } from '../newsCrawler';
import * as utils from '../../feeds/utils';

const rootUrl = 'https://healthmedia.com.tw';
const title = 'NOW健康';

export class HealthMediaNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }
    public async getNews(category: string = '1', id: string = '', count: number = 25) {
        let url = '';
        if (id) {
            url = `${rootUrl}/main.php?nm_id=${id}`;
        }
        else {
            url = `${rootUrl}/main.php?nm_class=${category}`;
        }

        let categoryName = '';
        let list = await this.getNewsList({
            url,
            options: utils.crawlerOptions,
            selector: 'div.main_news_list li',
            count,
            callback: ($, i) => {
                let title = $(i).find('div.main_news_txt h2').text();
                let link = rootUrl + '/' + $(i).find('a').attr('href');
                let image = rootUrl + '/' + $(i).find('a img').attr('src');
                let description = $(i).find('div.main_news_content').text();
                let pubDate = $(i).find('div.ti_left time').text();
                categoryName = $('div.main_title h2').text();

                return {
                    title,
                    link,
                    description,
                    image,
                    date: moment(pubDate, 'YYYY-MM-DD HH:mm:ss').toDate(),
                };
            }
        })
            
        return {
            title: `${title} ${categoryName}`,
            link: url,
            items: list,
        };
    }
}
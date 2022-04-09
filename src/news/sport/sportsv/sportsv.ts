import * as axios from 'axios';
import * as moment from 'moment';

import { NewsCrawler } from '../../newsCrawler';
import { ServiceContext } from '../../../services/service';
import * as utils from '../../../feeds/utils';

const rootUrl = 'https://www.sportsv.net';
const title = '運動視界';

const httpClient = axios.default;

const categoryMap = {
    
}


export class SportSVNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = '', subcategory: string = '',count: number = 15) {
        let url = `${rootUrl}`;

        if (category) {
            url = `${url}/${category}`;

            if (subcategory) {
                url = `${url}/${subcategory}`;
            }
        }
        url = `${url}/feed`;


        let list = await this.getRSSNewsList({
            url,
            count
        });

        let items = await this.getNewsDetials({
            list,
            options: utils.crawlerOptions,
            callback: (item, content) => {
                let image = content('meta[property="og:image"]').attr('content');
                item.image = image;
                return item;
            }
        });

        return {
            title: `${title}`,
            link: rootUrl,
            items: items
        };
    }
}
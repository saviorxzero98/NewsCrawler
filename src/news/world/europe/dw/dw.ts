import * as moment from 'moment';

import { crawlerHeaders } from '../../../../services/httpclient';
import { ServiceContext } from '../../../../services/service';
import { NewsCrawler } from '../../../newsCrawler';

const rootUrl = 'https://www.dw.com';
const rssRootUrl = 'https://rss.dw.com';
const title = 'DW';

export class DWNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = 'all', language: string = 'zh-hant', count: number = 15)  {
        let rssLanguage = this.getLanguage(language);
        let url = `${rssRootUrl}/rdf/rss-${rssLanguage}-all`;

        if (category) {
            url = `${rssRootUrl}/rdf/rss-${rssLanguage}-${category}`;
        }

        let { list } = await this.getNewsListFromRSS({
            url,
            count
        });

        list.forEach((i) => {
            let itemRootUrl = `${rootUrl}/${language}`;
            let pathList = i.link.replace(itemRootUrl, '').split('/');
            pathList[1] = encodeURIComponent(pathList[1]);
            i.link = `${itemRootUrl}${pathList.join('/')}`;
        });

        let items = await this.getNewsDetials({
            list,
            headers: crawlerHeaders,
            callback: (item, content, newsMeta) => {
                //item.description = newsMeta.description;
                item.image = newsMeta.image ?? item.image;
                return item;
            }
        });

        return {
            title: `${title}`,
            link: rootUrl,
            items: items,
        };
    }

    private getLanguage(language: string = 'zh') {
        if (language) {
            language = language.toLowerCase();

            if (language.startsWith('en')) {
                return 'en';
            }

            switch (language) {
                case 'cn':
                case 'simp':
                case 'zh-cn':
                case 'zh-sg':
                case 'zh-my':
                case 'zh-hans':
                case 'zh':
                case 'tw':
                case 'hk':
                case 'trad':
                case 'zh-tw':
                case 'zh-hk':
                case 'zh-mo':
                case 'zh-hant':
                    return 'chi';
            }
        }
        return language;
    }
}
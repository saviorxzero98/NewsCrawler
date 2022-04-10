import * as moment from 'moment';

import { crawlerHeaders } from '../../../../services/httpclient';
import { ServiceContext } from '../../../../services/service';
import { NewsCrawler } from '../../../newsCrawler';

const rootUrl = 'https://www.rfi.fr';
const title = 'rfi';
const titleMap = {
    cn: 'RFI 法国广播电台',
    tw: 'RFI 法國廣播電台'
}

export class RfiZhNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = '', language: string = 'zh-hant', count: number = 15)  {
        language = this.getLanguage(language);
        let url = `${rootUrl}/${language}`;
        let title = titleMap[language] || 'RFI';
        if (category) {
            url = `${url}/${encodeURIComponent(category)}`;
        }
        
        let crawler = {
            selector: 'div.m-item-list-article',
            callback: ($, i) => {
                let title = $(i).find('p.article__title ').text();
                let link = rootUrl + $(i).find('a').attr('href');
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
            options: crawlerHeaders,
            callback: (item, content) => {
                //let title = content('meta[property="og:title"]').attr('content');
                let description = content('meta[property="og:description"]').attr('content');
                let image = content('meta[property="og:image"]').attr('content');
                let pubDate = content('meta[property="article:published_time"]').attr('content');
                //item.title = title;
                item.description = description;
                item.image = image;
                item.date = moment(pubDate, 'YYYY-MM-DDTHH:mm').toDate();

                return item;
            }
        });

        return {
            title: `${title} ${category}`,
            link: url,
            items: items,
        };
    }

    private getLanguage(language: string = 'zh-hant') {
        if (language) {
            language = language.toLowerCase();

            switch (language) {
                case 'cn':
                case 'simp':
                case 'zh-cn':
                case 'zh-sg':
                case 'zh-my':
                case 'zh-hans':
                    return 'cn';

                case 'zh':
                case 'tw':
                case 'hk':
                case 'trad':
                case 'zh-tw':
                case 'zh-hk':
                case 'zh-mo':
                case 'zh-hant':
                    return 'tw';
            }
        }
        return 'tw';
    }
}
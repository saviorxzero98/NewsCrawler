import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

import { ServiceContext } from '../../../../services/service';
import { NewsCrawler } from '../../../newsCrawler';
import { Item } from 'feed';
import * as utils from '../../../../feeds/utils';

const httpClient = axios.default;

const languageMap = {
    'en-us': {
        rootUrl: 'https://www.rfa.org/english',
        title: 'Radio Free Asia'
    },
    'zh-hans': {
        rootUrl: 'https://www.rfa.org/mandarin',
        title: '自由亚洲电台'
    },
    'zh-hant': {
        rootUrl: 'https://www.rfa.org/cantonese',
        title: '自由亞洲電台'
    }
}

export class RFANewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = '', subcategory: string = '',  language: string = 'zh-hant', 
                         count: number = 15)  {
        language = this.getLanguage(language);
        let mapInfo = languageMap[language];
        let title = mapInfo.title;
        let url = mapInfo.rootUrl;
       
        switch (language) {
            case 'en-us':
                if (category) {
                    url = `${url}/${category}`;

                    if (subcategory) {
                        url = `${url}/${subcategory}`
                    }
                }
                url = `${url}/RSS`;
                break;

            case 'zh-hans':
            case 'zh-hant':
                if (category) {
                    url = `${url}/${category}`;
                    
                    if (subcategory) {
                        url = `${url}/${subcategory}`
                    }
                }

                url = `${url}/RSS`;
                break;
        }

        let list = await this.getRSSNewsList({
            url,
            count
        });

        let items = await Promise.all(
            list.map(async (item) => 
                this.services
                    .cache
                    .tryGet<Item>(item.link, async () => {
                        try {
                            let detailResponse = await httpClient.get(item.link, utils.crawlerOptions);
                            let data = detailResponse.data;
                            let image = data.image.download || '';
                            item.image = image
                            return item;
                        }
                        catch {
                            return item;
                        }
                    })
            )
        );

        return {
            title: `${title}`,
            link: url,
            items: items,
        };
    }

    private getLanguage(language: string = 'zh-hant') {
        if (language) {
            language = language.toLowerCase();
            
            if (language.startsWith('en')) {
                return 'en-us';
            }
            
            switch (language) {
                case 'cn':
                case 'zh-cn':
                case 'zh-sg':
                case 'zh-my':
                case 'zh-hans':
                    return 'zh-hans';

                case 'zh':
                case 'tw':
                case 'hk':
                case 'zh-tw':
                case 'zh-hk':
                case 'zh-mo':
                case 'zh-hant':
                    return 'zh-hant';
            }
        }
        return 'zh-hant';
    }
}
import * as moment from 'moment';

import { crawlerHeaders } from '../../../../services/httpclient';
import { ServiceContext } from '../../../../services/service';
import { NewsCrawler } from '../../../newsCrawler';

const languageMap = {
    'zh-hans': {
        rootUrl: 'https://www.bbc.com/zhongwen/simp',
        rssUrl: 'https://feeds.bbci.co.uk/zhongwen/simp/rss.xml',
        title: 'BBC中文网'
    },
    'zh-hant': {
        rootUrl: 'https://www.bbc.com/zhongwen/trad',
        rssUrl: 'https://feeds.bbci.co.uk/zhongwen/trad/rss.xml',
        title: 'BBC中文網'
    }
}

export class BBCZhNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(language: string = 'zh-hant', count: number = 15)  {
        language = this.getLanguage(language);
        let mapInfo = languageMap[language];
        let title = mapInfo.title;
        let rootUrl = mapInfo.rootUrl;
        let url = mapInfo.rssUrl;

        let list = await this.getNewsListFromRSS({
            url,
            count
        });

        let items = await this.getNewsDetials({
            list,
            options: crawlerHeaders,
            callback: (item, content) => {
                //let description = content('meta[property="og:description"]').attr('content');
                let image = content('meta[property="og:image"]').attr('content');
                //item.description = description;
                item.image = image
                return item;
            }
        });

        return {
            title: `${title}`,
            link: rootUrl,
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
                    return 'zh-hans';

                case 'zh':
                case 'tw':
                case 'hk':
                case 'trad':
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
import { crawlerHeaders } from '../../../../services/httpclient';
import { ServiceContext } from '../../../../services/service';
import { NewsCrawler } from '../../../newsCrawler';

const languageMap = {
    'en-us': {
        rootUrl: 'https://www.theepochtimes.com',
        title: 'The Epoch Times'
    },
    'zh-hans': {
        rootUrl: 'https://www.epochtimes.com/gb',
        title: '大纪元'
    },
    'zh-hant': {
        rootUrl: 'https://www.epochtimes.com/b5',
        title: '大紀元'
    },
    'ja-jp': {
        rootUrl: 'https://www.epochtimes.jp',
        title: '大紀元'
    }
}

export class EpochTimesNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = '', language: string = 'zh-hant', count: number = 15)  {
        language = this.getLanguage(language);
        let mapInfo = languageMap[language];
        let title = mapInfo.title;
        let url = mapInfo.rootUrl;
       
        switch (language) {
            case 'en-us':
                if (category) {
                    url = `${url}/${category}`;
                }
                url = `${url}/feed`;
                break;

            case 'zh-hans':
            case 'zh-hant':
                if (category) {
                    url = `${url}/${category}.htm`;
                }
                url = `${url}/feed`;
                break;

            case 'ja-jp':
                url = `${url}/category/${category || '170'}/feed`;
                break;
        }


        let list = await this.getNewsListFromRSS({
            url,
            count
        });

        if (language !== 'ja-jp') {
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
                link: url,
                items: items,
            };
        }

        return {
            title: `${title}`,
            link: url,
            items: list,
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

                case 'jp':
                case 'ja':
                case 'ja-jp':
                    return 'ja-jp';
            }
        }
        return 'zh-hant';
    }
}
import * as moment from 'moment';
import { simplecc } from "simplecc-wasm";
import { crawlerHeaders } from '../../../../services/httpclient';
import { ServiceContext } from '../../../../services/service';
import { NewsCrawler } from '../../../newsCrawler';

const languageMap = {
    'zh-hans': {
        rootUrl: 'https://cn.yna.co.kr',
        rssUrl: 'https://cn.yna.co.kr',
        title: '韩联社',
        rssMap: {
            'news': '滚动',
            'politics': '政治',
            'economy': '经济',
            'society': '社会',
            'culture-sports': '文娱体育',
            'nk': '朝鲜',
            'china-relationship': '韩中关系'
        }
    },
    'zh-hant': {
        rootUrl: 'https://cb.yna.co.kr/gate/big5/cn.yna.co.kr',
        rssUrl: 'https://cn.yna.co.kr',
        title: '韓聯社',
        rssMap: {
            'news': '即時',
            'politics': '政治',
            'economy': '經濟',
            'society': '社會',
            'culture-sports': '文化體育',
            'nk': '北朝鮮',
            'china-relationship': '韓中關係'
        }
    },
    'en': {
        rootUrl: 'https://en.yna.co.kr',
        rssUrl: 'https://en.yna.co.kr',
        title: 'Yonhap News Agency',
        rssMap: {
            'news': 'All News',
            'national': 'National',
            'nk': 'North Korea',
            'market': 'Market',
            'business': 'Business',
            'culture': 'Culture/K-pop',
            'sports': 'Sports'
        }
    },
    'ja': {
        rootUrl: 'https://jp.yna.co.kr',
        rssUrl: 'https://jp.yna.co.kr',
        title: 'ソウル聯合ニュース',
        rssMap: {
            'news': '記事一覧',
            'politics': '政治',
            'nk': '北朝鮮',
            'japan-relationship': '韓日関係',
            'economy': '経済',
            'society-culture': '社会・文化',
            'it-science': 'IT・科学',
            'entertainment-sports': '芸能・スポーツ'
        }
    }
}


export class YNANewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = '', language: string = 'zh-hant', count: number = 15) {
        let lang = this.getLanguage(language);
        let mapInfo = languageMap[lang];
        let title = mapInfo.title;
        let url = `${mapInfo.rssUrl}/RSS/${category}.xml`;
        let categoryName = mapInfo.rssMap[category];

        if (categoryName) {
            let { list } = await this.getNewsListFromRSS({
                url,
                count,
                callback: (item) => {
                    item.isoDate = moment(item.pubDate, 'YYYYMMDDHHmmss').toDate().toISOString();
                    
                    let openccType = this.getOpenCCType(language);
                    if (openccType) {
                        item.title = simplecc(item.title, openccType);
                        item.content = simplecc(item.content, openccType);
                    }
                    
                    return item;
                }
            });

            let items = await this.getNewsDetials({
                list,
                headers: crawlerHeaders,
                callback: (item, content, newsMeta) => {
                    item.image = newsMeta.image;
                    return item;
                }
            });
                
            return {
                title: `${title}`,
                link: url,
                items: items
            };
        }

        return {
            title: `${title}`,
            link: url,
            items: []
        };
    }

    private getLanguage(language: string = 'zh-hant') {
        if (language) {
            language = language.toLowerCase();

            if (language.startsWith('en')) {
                return 'en';
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

                case 'ja':
                case 'jp':
                case 'ja-jp':
                    return 'ja';
            }
        }
        return 'zh-hant';
    }

    private getOpenCCType(language: string = 'zh-hant') {
        if (language) {
            language = language.toLowerCase();

            switch (language) {
                case 'tw':
                case 'zh-tw':
                    return 's2twp'
               
                case 'hk':
                case 'zh-hk':
                case 'zh-mo':
                    return 's2hk';

                case 'zh':
                case 'zh-hant':
                    return 's2t';
            }
        }
        return '';
    }
}
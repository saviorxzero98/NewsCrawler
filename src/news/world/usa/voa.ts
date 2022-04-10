import * as moment from 'moment';

import { ServiceContext } from '../../../services/service';
import { NewsCrawler } from '../../newsCrawler';
import * as utils from '../../../feeds/utils';

const languageMap = {
    'en-us': {
        rootUrl: 'https://www.voanews.com',
        title: 'VOA',
        rssMap: {
            'USA': 'https://www.voanews.com/api/zq$omekvi_',
            'Immigration': 'https://www.voanews.com/api/zgvmqye_o_qv',
            'Africa': 'https://www.voanews.com/api/z-$otevtiq',
            'East Asia': 'https://www.voanews.com/api/zo$o_egviy',
            'China News': 'https://www.voanews.com/api/zmjuqte$_kqo',
            'South & Central Asia': 'https://www.voanews.com/api/z_-mqyerv_qv',
            'Middle East': 'https://www.voanews.com/api/zr$opeuvim',
            'Europe': 'https://www.voanews.com/api/zj$oveytit',
            'Americas': 'https://www.voanews.com/api/zoripegtim',
            'Technology': 'https://www.voanews.com/api/zyritequir',
            'Economy': 'https://www.voanews.com/api/zy$oqeqtii',
            'Science & Health': 'https://www.voanews.com/api/zt$opeitim',
            'Arts & Culture': 'https://www.voanews.com/api/zp$ove-vir'
        }
    },
    'zh-hans': {
        rootUrl: 'https://www.voachinese.com',
        title: '美国之音',
        rssMap: {
            '新闻': 'https://www.voachinese.com/api/zm_yqe$$yi',
            '美国': 'https://www.voachinese.com/api/zg_yre_rvq',
            '中国': 'https://www.voachinese.com/api/zyyyoeqqvi',
            '港澳': 'https://www.voachinese.com/api/zmyyte$rvq',
            '台湾': 'https://www.voachinese.com/api/zivymejqv_',
            '国际': 'https://www.voachinese.com/api/z__yoerrvp',
            '美中关系': 'https://www.voachinese.com/api/zuvyiepovp',
            '经济·金融·贸易': 'https://www.voachinese.com/api/z-_yoevrvi',
            '人权·法律·宗教': 'https://www.voachinese.com/api/zutpqvepimqt',
            '科技·教育·文化·娱乐·体育·健康': 'https://www.voachinese.com/api/ztg_qtei_yqt',
            '军事': 'https://www.voachinese.com/api/z_vyverovr',
            '劳工': 'https://www.voachinese.com/api/ztotpeigtp',
            '生态环境': 'https://www.voachinese.com/api/zoyy_egrvv'
        }
    },
    'zh-hant': {
        rootUrl: 'https://www.voacantonese.com',
        title: '美國之音',
        rssMap: {
            '新聞': 'https://www.voacantonese.com/api/zprtie-ttp',
            '美國': 'https://www.voacantonese.com/api/z$rtmetut_',
            '中國': 'https://www.voacantonese.com/api/zyrtyequty',
            '港澳': 'https://www.voacantonese.com/api/z_rt_erut_',
            '台灣': 'https://www.voacantonese.com/api/zrqtyeuuty',
            '國際': 'https://www.voacantonese.com/api/zvrtveoutv',
            '美中關係': 'https://www.voacantonese.com/api/zqutyekiuv',
            '經貿': 'https://www.voacantonese.com/api/zkrtqemutq',
            '健康': 'https://www.voacantonese.com/api/zgrtoe_uti',
        }
    }
}

export class VOANewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string,  language: string = 'zh-hant', count: number = 15) {
        language = this.getLanguage(language);
        let mapInfo = languageMap[language];
        let title = mapInfo.title;
        let url = mapInfo.rssMap[category] ?? Object.values(mapInfo.rssMap)[0];       

        let list = await this.getRSSNewsList({
            url,
            count
        });

        let items = await this.getNewsDetials({
            list,
            options: utils.crawlerOptions,
            callback: (item, content) => {
                //let description = content('meta[property="og:description"]').attr('content');
                let image = content('meta[property="og:image"]').attr('content');
                //item.description = description;
                item.image = image
                return item;
            }
        });
            
        return {
            title: `${title} ${category}`,
            link: url,
            items: items,
        };
    }

    public async getNewsByRss(rss: string = '', language: string = 'zh-hant', count: number = 15) {
        language = this.getLanguage(language);
        let rootUrl = languageMap[language].rootUrl;
        let title =  languageMap[language].title;
        let url = `${rootUrl}/api/${rss}`;

        let list = await this.getRSSNewsList({
            url,
            count
        });

        let items = await this.getNewsDetials({
            list,
            options: utils.crawlerOptions,
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

    private getLanguage(language: string = 'zh-hant') {
        if (language) {
            language = language.toLowerCase();
            
            if (language.startsWith('en')) {
                return 'en-us';
            }
            
            switch (language) {
                case 'zh':
                case 'zh-cn':
                case 'zh-sg':
                case 'zh-my':
                case 'zh-hans':
                    return 'zh-hans';

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
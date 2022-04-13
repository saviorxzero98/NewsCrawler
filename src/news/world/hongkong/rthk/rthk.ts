import { crawlerHeaders, HttpClient } from '../../../../services/httpclient';
import { ServiceContext } from '../../../../services/service';
import { NewsCrawler } from '../../../newsCrawler';

const rootUrl = 'https://www.rthk.hk';
const rssRootUrl = 'https://rthk.hk';
const title = '香港電台';

const rssMap = {
    local: '本地新聞',
    greaterchina: '大中華新聞',
    international: '國際新聞',
    finance: '財經新聞',
    sport: '體育新聞'
}


export class RTHKNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = 'local', language: string = '', count: number = 15) {
        let lang = this.getLanguage(language);

        if (category && rssMap[category]) {
            let categoryName = rssMap[category];
            if (lang !== 'c' || category !== 'greaterchina') {
                category = lang + category;
            }
            let url = `${rssRootUrl}/rthk/news/rss/${lang}_expressnews_${category}.xml`

            let { list, title } = await this.getNewsListFromRSS({
                url,
                count
            });
    
            let items = await this.getNewsDetials({
                list,
                headers: crawlerHeaders,
                callback: (item, content, newsMeta) => {
                    //item.description = newsMeta.description;
                    item.image = newsMeta.image;
                    return item;
                }
            });

            return {
                title: `${title} ${categoryName}`,
                link: rootUrl,
                items: items,
            };
        }

        return {
            title: `${title}`,
            link: rootUrl,
            items: [],
        };
    }

    private getLanguage(language: string = 'zh-hant') {
        if (language) {
            language = language.toLowerCase();

            if (language.startsWith('en')) {
                return 'e';
            }

            switch (language) {
                case 'cn':
                case 'zh-cn':
                case 'zh-sg':
                case 'zh-my':
                case 'zh-hans':
                case 'zh':
                case 'tw':
                case 'hk':
                case 'zh-tw':
                case 'zh-hk':
                case 'zh-mo':
                case 'zh-hant':
                    return 'c';
            }
        }
        return 'c';
    }
}
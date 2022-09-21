import { crawlerHeaders, HttpClient } from '../../../../services/httpclient';
import { ServiceContext } from '../../../../services/service';
import { NewsCrawler } from '../../../newsCrawler';

const rootUrl = 'https://www.nippon.com';
const titleMap = {
    'ja': 'ニッポンドットコム',
    'en': 'Nippon',
    'cn': '日本网',
    'hk': '日本網'
}

export class NipponNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = 'news', language: string = 'hk', 
                         count: number = 15) {
        let locale = this.getLanguage(language);
        let path = (category === 'Science,Technology') ? 'condition4' : 'category_code';
        let url = `${rootUrl}/api/search/${locale}/${path}/20/1/${category}?t=${Date.now()}`;

        this.services.logger.logGetUrl(url);

        let items = [];

        try {
            let httpClient = new HttpClient();
            let response = await httpClient.get(url, crawlerHeaders);

            let list = response.data.body.dataList.map((item) => {
                return {
                    title: item.title,
                    description: '',
                    image: `${rootUrl}/${item.pub_thumbnail_url}`,
                    link: `${rootUrl}/${item.pub_url}`,
                    date: new Date(item.pub_date)
                }
            });
            list = list.filter(i => i.title && i.link)
                    .slice(0, count);

            items = await this.getNewsDetials({
                list,
                headers: crawlerHeaders,
                callback: (item, content, newsMeta) => {
                    item.description = newsMeta.description;
                    if (newsMeta.image) {
                        item.image = newsMeta.image;
                    }
                    return item;
                }
            });
        }
        catch {
            this.services.logger.logError(`Get News '${url}' Error`);
        }

        return {
            title: `${titleMap[locale]}`,
            link: url,
            items: items,
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
                    return 'cn';

                case 'zh':
                case 'tw':
                case 'hk':
                case 'zh-tw':
                case 'zh-hk':
                case 'zh-mo':
                case 'zh-hant':
                    return 'hk';

                case 'ja':
                case 'jp':
                case 'ja-jp':
                    return 'ja';
            }
        }
        return 'hk';
    }
}
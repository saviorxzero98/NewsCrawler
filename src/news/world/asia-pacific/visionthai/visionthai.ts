import { crawlerHeaders } from '../../../../services/httpclient';
import { ServiceContext } from '../../../../services/service';
import { NewsCrawler } from '../../../newsCrawler';

const rootUrl = 'https://visionthai.net';
//const title = 'Vision Thai 看見泰國';

export class VisionThaiNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(topic: string = '', category: string = '', 
                         language: string = 'zh-hant', count: number = 15) {
        let url = this.getUrl(topic, category, language);

        let { list, title } = await this.getNewsListFromRSS({
            url,
            count
        });

        let items = await this.getNewsDetials({
            list,
            headers: crawlerHeaders,
            callback: (item, content, newsMeta) => {
                item.description = content('meta[name="description"]').attr('content') || item.description;
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

    private getUrl(topic: string = '', category: string = '', language: string = 'zh-hant') {
        let lang = this.getLanguage(language);
        let url = rootUrl;

        if (lang) {
            url = `${url}/${lang}`;
        }

        if (topic) {
            url = `${url}/topic/${topic}`;

            if (category) {
                url = `${url}/${category}`;
            }
        }

        url = `${url}/feed`;

        return url;
    }

    private getLanguage(language: string = 'zh-hant') {
        if (language) {
            language = language.toLowerCase();

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
                    return '';
            }
        }
        return '';
    }
}

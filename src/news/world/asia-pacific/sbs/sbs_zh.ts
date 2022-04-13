import { crawlerHeaders, HttpClient } from '../../../../services/httpclient';
import { ServiceContext } from '../../../../services/service';
import { NewsCrawler } from '../../../newsCrawler';

const rootUrl = 'https://www.sbs.com.au';

const languageMap = {
    'zh-hant': {
        path: 'language/cantonese',
        title: 'SBS中文'
    },
    'zh-hans': {
        path: 'language/mandarin',
        title: 'SBS中文'
    }
}


export class SBSZhCNNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = 'news', language: string = 'zh-hant', count: number = 15) {
        let locale = this.getLanguage(language);
        let mapInfo = languageMap[locale];
        let path = mapInfo.path;
        let title = mapInfo.title;
        let url = `${rootUrl}/${path}/news/${locale}`;
        if (category) {
            url = `${rootUrl}/${path}/${category}/${locale}`;
        }

        let crawler = {
            selector: 'a.media-image__link',
            callback: ($, i) => {
                let title = $(i).attr('title');
                let link = rootUrl + $(i).attr('href');

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
            headers: crawlerHeaders,
            callback: (item, content, newsMeta, response) => {
                item.description = newsMeta.description;
                item.image = newsMeta.image;

                let pubDate = content('meta[itemprop="datePublished"]').attr('content');
                item.date = new Date(pubDate);

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
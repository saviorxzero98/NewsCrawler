import { crawlerHeaders } from '../../../../services/httpclient';
import { ServiceContext } from '../../../../services/service';
import { NewsCrawler } from '../../../newsCrawler';

const rootUrl = 'https://www.rfi.fr';
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
            headers: crawlerHeaders,
            callback: (item, content, newsMeta) => {
                //item.title = newsMeta.title;
                item.description = newsMeta.description;
                item.image = newsMeta.image ?? item.image;

                let pubDate = content('div.m-pub-dates__date time').attr('datetime');
                item.date = new Date(pubDate);

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
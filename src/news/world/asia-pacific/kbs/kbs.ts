import { crawlerHeaders, HttpClient } from '../../../../services/httpclient';
import { ServiceContext } from '../../../../services/service';
import { NewsCrawler } from '../../../newsCrawler';

const rootUrl = 'https://world.kbs.co.kr';
const title = 'KBS World';

export class KBSNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = '', language: string = 'k', count: number = 15) {
        let lang = this.getLanguage(language);
        let url = `${rootUrl}/service/news_list.htm?lang=${lang}`;

        if (category) {
            url = `${url}&id=${category}`;
        }

        let crawler = {
            selector: '.comp_contents_1x article',
            callback: ($, i) => {
                $('.comp_pagination').remove();

                let title = $(i).find('h2 a').text();
                let link = $(i).find('h2 a').attr('href');
                let image = $(i).find('img').attr('src');

                let pubDate = '';
                if (link) {
                    link = `${rootUrl}/service${link.replace('./', '/')}`;
                    image = $(i).find('img').attr('src');
                    pubDate = $(i).find('.date').text().match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/)[1];
                }
                
                return {
                    title,
                    link,
                    image,
                    description: '',
                    date: new Date(pubDate)
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
                item.description = newsMeta.description;
                return item;
            }
        });

        return {
            title: `${title}`,
            link: url,
            items: items,
        };
    }

    public async getTodayNews(language: string = 'k', count: number = 15) {
        let lang = this.getLanguage(language);
        let url = `${rootUrl}/service/news_today.htm?lang=${lang}`;

        let crawler = {
            selector: '.comp_text_1x article',
            callback: ($, i) => {
                let title = $(i).find('h2 a').text();
                let link = $(i).find('h2 a').attr('href');

                let pubDate = '';
                if (link) {
                    link = `${rootUrl}/service${link.replace('./', '/')}`;
                    pubDate = $(i).find('.date').text();
                }
                
                return {
                    title,
                    link,
                    image: '',
                    description: '',
                    date: new Date(pubDate)
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
                item.description = newsMeta.description;
                item.image = newsMeta.image;
                return item;
            }
        });

        return {
            title: `${title}`,
            link: url,
            items: items,
        };
    }


    private getLanguage(language: string = 'k') {
        if (language) {
            language = language.toLowerCase();

            if (language.startsWith('en')) {
                return 'e';
            }

            switch (language) {
                case 'e':
                    return 'e';

                case 'c':
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

                case 'j':
                case 'ja':
                case 'jp':
                case 'ja-jp':
                    return 'j';

                case 'k':
                case 'ko-kr':
                case 'kr':
                    return 'k'
            }
        }
        return language;
    }
}
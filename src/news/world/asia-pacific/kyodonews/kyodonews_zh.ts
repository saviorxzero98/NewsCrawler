import * as moment from 'moment';
import { crawlerHeaders, HttpClient } from '../../../../services/httpclient';
import { ServiceContext } from '../../../../services/service';
import { NewsCrawler } from '../../../newsCrawler';

const languageMap = {
    'zh-hans': {
        url: 'https://china.kyodonews.net',
        title: '共同网'
    },
    'zh-hant': {
        url: 'https://tchina.kyodonews.net',
        title: '共同網'
    }
}

export class KyodoNewsZhNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = '', language: string = 'zh-hant', count: number = 15) {
        let lang = this.getLanguage(language);
        let mapInfo = languageMap[lang];
        let title = mapInfo.title;
        let url = mapInfo.url;
        let categoryName = '';

        if (category) {
            url = `${url}/news/${category}`;
        }

        let crawlers = [
              {
                selector: 'div.sec-latest li',
                callback: ($, i) => {
                    categoryName = $('div.sec-latest h2').text();

                    let title = $(i).find('h3').text();
                    let link = mapInfo.url + $(i).find('a').attr('href');
                    let image = $(i).find('img').attr('data-src');
                    let description = $(i).find('p.latesttxt').text();
                    let pubDate = $(i).find('p.time').text();
                    pubDate = this.parsePubDate(pubDate);

                    return {
                        title,
                        link,
                        image: image,
                        description,
                        date: moment(pubDate, 'YYYY年 MM月 DD日 - HH:mm').toDate(),
                    };
                }
            }
        ]
        let list = await this.getNewsList({
            url,
            options: crawlerHeaders,
            count,
            crawlers: crawlers
        });
    
        return {
            title: `${title} ${categoryName}`,
            link: url,
            items: list
        };
    }


    private getLanguage(language: string = 'zh-hant') {
        if (language) {
            language = language.toLowerCase();

            switch (language) {
                case 'china':
                case 'cn':
                case 'zh-cn':
                case 'zh-sg':
                case 'zh-my':
                case 'zh-hans':
                    return 'zh-hans';

                case 'tchina':
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

    private parsePubDate(text: string): string {
        // YYYY-MM-DD HH:mm:ss
        const pattern = /(\d{4})年 (\d{1,2})月 (\d{1,2})日 - (\d{1,2}):(\d{1,2})/g;
        let matchList = text.match(pattern);

        if (matchList.length != 0) {
            return matchList[0];
        }
        return '';
    }
}
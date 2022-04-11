import { crawlerHeaders } from '../../../../services/httpclient';
import { ServiceContext } from '../../../../services/service';
import { NewsCrawler } from '../../../newsCrawler';

const languageMap = {
    'zh-hans': {
        rootUrl: 'https://cn.nikkei.com',
        title: '日本经济新闻中文版'
    },
    'zh-hant': {
        rootUrl: 'https://zh.cn.nikkei.com',
        title: '日本經濟新聞中文版'
    }
}

export class NikkeiZhNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = '', subcategory: string = '',  
                         language: string = 'zh-hant', count: number = 15)  {
        language = this.getLanguage(language);
        let mapInfo = languageMap[language];
        let url = `${mapInfo.rootUrl}/rss.html`;
        let title = mapInfo.title;

        if (category && subcategory) {
            url =`${mapInfo.rootUrl}/${category}/${subcategory}.feed?type=rss`;
        }

        let crawler = {
            selector: 'channel item',
            callback: ($, i) => {
                let title = $(i).find('title').html();
                let link = $(i).find('guid').html();
                let description = $(i).find('description').html();
                let pubDate = $(i).find('pubDate').html();
                
                return {
                    id: link,
                    title,
                    link,
                    image: '',
                    description: description,
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

        if (category && subcategory) {
            return {
                title: `${title}`,
                link: url,
                items: list,
            };
        }

        let items = await this.getNewsDetials({
            list,
            options: crawlerHeaders,
            callback: (item, content) => {
                let description = content('meta[name="twitter:description"]').attr('content');
                let image = content('meta[name="twitter:image:src"]').attr('content');
                item.description = description;
                if (image && image !== `${mapInfo.rootUrl}/`) {
                    item.image = image;
                }
                return item;
            }
        });
         
        return {
            title: `${title}`,
            link: url,
            items: items
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
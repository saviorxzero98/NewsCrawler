import { crawlerHeaders } from '../../../../services/httpclient';
import { ServiceContext } from '../../../../services/service';
import { NewsCrawler } from '../../../newsCrawler';

const languageMap = {
    'zh-hans': {
        rootUrl: 'https://www.ftchinese.com',
        title: 'FT中文网',
        rssMap: {
            'feed': '每日更新',
            'news': '今日焦点',
            'hotstoryby7day': '十大热门文章',
            'lifestyle': '生活时尚'
        }
    },
    'zh-hant': {
        rootUrl: 'https://big5.ftchinese.com',
        title: 'FT中文網',
        rssMap: {
            'feed': '每日更新',
            'news': '今日焦點',
            'hotstoryby7day': '十大熱門文章',
            'lifestyle': '生活時尚'
        }
    }
}

export class FTNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = 'news', language: string = 'zh-hant', count: number = 15)  {
        language = this.getLanguage(language);
        let mapInfo = languageMap[language];
        let title = mapInfo.title;
        let url = mapInfo.rootUrl;
        let categoryName = '';

        if (category) {
            category = category.toLowerCase().split('-').join('/');
            url = `${url}/rss/${category}`;
            categoryName = mapInfo.rssMap[category] ?? '';
        }

        let list = await this.getRSSNewsList({
            url,
            count
        });
        list.forEach(i => i.link.replace('http://', 'https://'))

        let items = await this.getNewsDetials({
            list,
            options: crawlerHeaders,
            callback: (item, content) => {
                let title = content('meta[property="og:title"]').attr('content');
                let description = content('meta[property="og:description"]').attr('content');
                let image = content('meta[property="og:image"]').attr('content');
                item.title = title;
                item.description = description;
                item.image = image
                return item;
            }
        });

        return {
            title: `${title} ${categoryName}`,
            link: url,
            items: items,
        };
    }

    private getLanguage(language: string = 'zh-hant') {
        if (language) {
            language = language.toLowerCase();

            switch (language) {
                case 'cn':
                case 'chinese':
                case 'zh-cn':
                case 'zh-sg':
                case 'zh-my':
                case 'zh-hans':
                    return 'zh-hans';

                case 'zh':
                case 'big5':
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
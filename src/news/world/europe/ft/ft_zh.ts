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

export class FTZhNewsCrawler extends NewsCrawler {
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

            category = this.tryGetMapKey(mapInfo.rssMap, category);
            if (category && mapInfo.rssMap[category]) {
                url = `${url}/rss/${category}`;
                categoryName = mapInfo.rssMap[category];
            }
            else {
                url = `${url}/rss/news`;
                categoryName = mapInfo.rssMap['news'];
            }
        }

        let { list } = await this.getNewsListFromRSS({
            url,
            count
        });
        list.forEach(i => i.link.replace('http://', 'https://'))

        let items = await this.getNewsDetials({
            list,
            headers: crawlerHeaders,
            callback: (item, content, newsMeta) => {
                item.title = newsMeta.title;
                item.description = newsMeta.description;
                item.image = newsMeta.image ?? item.image;
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
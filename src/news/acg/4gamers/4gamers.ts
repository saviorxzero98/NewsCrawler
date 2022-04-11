
import { HttpClient, crawlerHeaders } from '../../../services/httpclient';
import { NewsCrawler } from '../../newsCrawler';
import { ServiceContext } from '../../../services/service';


const rootUrl = 'https://www.4gamers.com.tw';
const title = '4Gamers';

const categoryMap = {
    '352': '遊戲資訊',
    '353': '電子競技',
    '355': '科技硬體',
    '359': '深度專題',
    '1109': '實況直播',
    '1115': '品牌提供',
    '1116': '影劇動漫',
    '1117': '潮流宅物',
    '1118': '限時免費',
    '1119': '🔞成人限定',
    '1120': '👬男上加男'
}


export class FourGamersNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(count: number = 15) {
        let url = `${rootUrl}/rss/latest-news`;

        let list = await this.getRSSNewsList({
            url,
            count
        });

        let items = await this.getNewsDetials({
            list,
            options: crawlerHeaders,
            callback: (item, content) => {
                let image = content('meta[property="og:image"]').attr('content');
                item.image = image;
                return item;
            }
        });

        return {
            title: `${title} 最新`,
            link: rootUrl,
            items: items
        };
    }

    public async getNewsByCategory(category: string = '352', count: number = 15) {
        if (category && categoryMap[category]) {
            let url = `${rootUrl}/site/api/news/by-category/${category}?pageSize=${count}`;

            this.services.logger.logGetUrl(url);

            let httpClient = new HttpClient();
            let response = await httpClient.get(url);
            let results = response.data.data.results;
            let list = results.map((item) => ({
                title: item.title,
                image: item.smallBannerUrl,
                description: '',
                pubDate: new Date(item.createPublishedAt * 1),
                link: item.canonicalUrl,
            }));

            let items = await this.getNewsDetials({
                list,
                options: crawlerHeaders,
                callback: (item, content) => {
                    let description = content('meta[name="description"]').attr('content');
                    let image = content('meta[property="og:image"]').attr('content');
                    item.description = description;
                    item.image = image || item.image;
                    return item;
                }
            });
            
            return {
                title: `${title} ${categoryMap[category]}`,
                link: url,
                items: items
            };
        }

        return {
            title: `${title}`,
            link: rootUrl,
            items: []
        };
    }

    public async getNewsByTag(tag: string = '', count: number = 15) {
        if (tag) {
            let url = `${rootUrl}/site/api/news/by-tag?tag=${encodeURIComponent(tag)}&pageSize=${count}`;

            let httpClient = new HttpClient();
            let response = await httpClient.get(url);
            let results = response.data.data.results;
            let list = results.map((item) => ({
                title: item.title,
                image: item.smallBannerUrl,
                description: '',
                pubDate: new Date(item.createPublishedAt * 1),
                link: item.canonicalUrl,
            }))

            let items = await this.getNewsDetials({
                list,
                options: crawlerHeaders,
                callback: (item, content) => {
                    let description = content('meta[name="description"]').attr('content');
                    let image = content('meta[property="og:image"]').attr('content');
                    item.description = description;
                    item.image = image || item.image;
                    return item;
                }
            });
            
            return {
                title: `${title} ${tag}`,
                link: url,
                items: items
            };
        }

        return {
            title: `${title} ${tag}`,
            link: rootUrl,
            items: []
        };
    }

    public async getNewsByTopic(topic: string = '', count: number = 15) {
        if (topic) {
            let url = `${rootUrl}/site/api/news/option-cfg/${topic}?pageSize=${count}`;

            let httpClient = new HttpClient();
            let response = await httpClient.get(url);
            let results = response.data.data.results;
            let list = results.map((item) => ({
                title: item.title,
                image: item.smallBannerUrl,
                description: '',
                pubDate: new Date(item.createPublishedAt * 1),
                link: item.canonicalUrl,
            }))

            let items = await this.getNewsDetials({
                list,
                options: crawlerHeaders,
                callback: (item, content) => {
                    let description = content('meta[name="description"]').attr('content');
                    let image = content('meta[property="og:image"]').attr('content');
                    item.description = description;
                    item.image = image || item.image;
                    return item;
                }
            });
            
            return {
                title: `${title} ${topic}`,
                link: url,
                items: items
            };
        }

        return {
            title: `${title} ${topic}`,
            link: rootUrl,
            items: []
        };
    }
}
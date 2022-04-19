import { ServiceContext } from '../../services/service';
import { NewsCrawler } from '../newsCrawler';

const rootUrl = 'https://www.eracom.com.tw';
const title = '年代新聞'

const categoryMap = {
    political: '政治',
    LocalNews: '地方',
    Society: '社會',
    Life: '生活',
    WorldNews: '國際',
    Entertainment: '娛樂',
    Sport: '體育',
    Finance: '財經',
    Astro: '命理',
    Art: '藝文',
    Food: '美食'
};

export class ERANewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = '', count: number = 15) {
        category = this.tryGetMapKey(categoryMap, category);
        if (categoryMap && categoryMap[category]) {
            return await this.getNewsByCategory(category, count);
        }
        
        
        let url = `${rootUrl}/EraNews/UpToDate`;
        
        let crawler = {
            selector: 'div.jsnews_info ul.clearfix li',
            callback: ($, i) => {
                let title = $(i).find('div.tib-desc p.tib-title a').text();
                let link = $(i).find('div.tib-txt a').attr('href');
                let image = $(i).find('img').attr('src');
                let description = $(i).find('p.cutbrief a').text();
                let pubDate = $(i).find('div.tib-date p').attr('data-id');

                return {
                    title,
                    link,
                    image,
                    description,
                    date: new Date(pubDate)
                };
            }
        };
        let list = await this.getNewsList({
            url,
            count,
            crawlers: [ crawler ]
        });

        return {
            title: `${title} 最新`,
            link: url,
            items: list,
        };
    }
 
    public async getNewsByCategory(category: string = 'political', count: number = 15) {
        let url = `${rootUrl}/EraNews/Home/${category}`;

        let crawler = {
            selector: 'div.newslist ul.clearfix li',
            callback: ($, i) => {
                let title = $(i).find('div.tib-desc p.tib-title').text();
                let link = $(i).find('div.tib-txt a').attr('href');
                let image = $(i).find('div.tib-txt img').attr('src');
                let description = $(i).find('div.tib-desc a.detail-link').text();
                let pubDate = $(i).find('div.tib-desc p.date').text();

                return {
                    title,
                    link,
                    image,
                    description,
                    date: new Date(pubDate)
                };
            }
        };
        let list = await this.getNewsList({
            url,
            count,
            crawlers: [ crawler ]
        });

        return {
            title: `${title} ${categoryMap[category]}`,
            link: url,
            items: list,
        };
    }
}
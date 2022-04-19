import { crawlerHeaders } from '../../services/httpclient';
import { ServiceContext } from '../../services/service';
import { NewsCrawler } from '../newsCrawler';

const rootUrl = 'https://news.cts.com.tw';
const title = '華視新聞';

const pageMap = {
    real: '即時',
    weather: '氣象',
    politics: '政治',
    international: '國際',
    society: '社會',
    sports: '運動',
    life: '生活',
    money: '財經',
    local: '地方',
    general: '綜合',
    arts: '藝文',
    entertain: '娛樂'
};

export class CTSNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(page: string = 'real', count: number = 15) {
        let url = `${rootUrl}/real/index.html`;
        let pageName = pageMap['real'];

        page = this.tryGetMapKey(pageMap, page);
        if (page && pageMap[page]) {
            url = `${rootUrl}/${page}/index.html`;
            pageName = pageMap[page];
        }
        
        let crawler = {
            selector: 'div.newslist-container a',
            callback: ($, i) => {
                let pubDate = $(i).find('p.newstitle span.newstime').text();
                $(i).find('p.newstitle span.newstime').remove();
                let title = $(i).find('p.newstitle').text();
                //let image = $(i).find('div.newsimg-thumb img').attr('src');
                let link = $(i).attr('href');

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
                item.image = newsMeta.image ?? item.image;

                //content('div.artical-content div.cts-tbfs').remove();
                //content('div.artical-content p.news-src').remove();
                //let description = content('div.artical-content').html();
                
                return item;
            }
        });
        
        return {
            title: `${title} ${pageName}`,
            link: url,
            items: items,
        };
    }
}
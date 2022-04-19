import { ServiceContext } from '../../services/service';
import { NewsCrawler } from '../newsCrawler';

const rootUrl = 'https://www.nexttv.com.tw';
const title = '壹電視新聞';

const categoryMap = {
    OnlineLatestNews: '最新',
    Politics: '政治',
    LocalNews: '地方',
    Society: '社會',
    Life: '生活',
    WorldNews: '國際',
    China: '兩岸',
    healthy: '健康',
    Entertainment: '娛樂',
    Sport: '體育',
    Finance: '財經'
};

export class NextTVNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }
    
    public async getNews(category: string = 'OnlineLatestNews', count: number = 15) {
        let url = `${rootUrl}/NextTV/News/Home/OnlineLatestNews`;
        let categoryName = '最新';
        if (category && categoryMap[category])  {
            url = `${rootUrl}/NextTV/News/Home/${categoryMap}`;
            categoryName = categoryMap[category];
        }

        let crawler = {
            selector: 'ul.yxw_list li',
            callback: ($, i) => {
                let title = $(i).find('div.tit a').text();
                let link = $(i).find('a.more').attr('href');
                let image = $(i).find('div.imgbox img').attr('src');
                let description = $(i).find('div.brief').text();
                let pubDate = $(i).find('div.time').text();

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
            title: `${title} ${categoryName}`,
            link: url,
            items: list,
        };
    }
}
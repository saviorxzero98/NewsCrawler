import { crawlerHeaders } from '../../services/httpclient';
import { ServiceContext } from '../../services/service';
import { NewsCrawler } from '../newsCrawler';

const rootUrl = 'https://news.tvbs.com.tw';
const title = 'TVBS新聞';

const categoryMap = {
    realtime: '即時',
    politics: '政治',
    local: '社會',
    world: '全球',
    health: '健康',
    entertainment: '娛樂',
    life: '生活',
    money: '理財房地產',
    china: '大陸',
    tech: '科技',
    focus: 'Focus',
    travel: '食尚',
    fun: '新奇',
    sports: '運動'
}

export class TVBSNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }
    
    public async getNews(category: string = '', count: number = 15) {
        let url = '';
        let categoryName = '';
        if (category !== 'realtime') {
            url = `${rootUrl}/realtime/${category}`;
            categoryName = categoryMap[category] || '';
        }
        else {
            url = `${rootUrl}/realtime/`;
            categoryName = categoryMap['realtime'];
        }

        let crawler = {
            selector: 'div.news_list div.list ul li',
            callback: ($, i) => {
                let title = $(i).find('a h2').text();
                let link = rootUrl + $(i).find('a').attr('href');
                let image = $(i).find('a img.lazyimage').attr('data-original');

                return {
                    title,
                    link,
                    image,
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
                item.description = newsMeta.description;
                item.date = newsMeta.pubDate;

                //let description = content('div#news_detail_div').html();

                return item;
            }
        });

        return {
            title: `${title} ${categoryName}`,
            link: url,
            items: items,
        };
    }
}
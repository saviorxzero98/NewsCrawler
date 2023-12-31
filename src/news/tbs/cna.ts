import { crawlerHeaders } from '../../services/httpclient';
import { ServiceContext } from '../../services/service';
import { NewsCrawler } from '../newsCrawler';

const rootUrl = 'https://www.cna.com.tw';
const title = '中央社 CNA';

const categoryMap = {
    aall: '即時',
    aipl: '政治',
    aopl: '國際',
    acn: '兩岸',
    aie: '產經',
    asc: '證券',
    ait: '科技',
    ahel: '生活',
    asoc: '社會',
    aloc: '地方',
    acul: '文化',
    aspt: '運動',
    amov: '娛樂'
};

export class CNANewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    
    public async getNews(category: string = 'aall', count: number = 15) {
        let url = `${rootUrl}/list/aall.aspx`;
        let categoryName = categoryMap['aall'];
        if (/^\d+$/.test(category)) {
            url = `${rootUrl}/topic/newstopic/${category}.aspx`;
        } 
        else {
            category = this.tryGetMapKey(categoryMap, category);

            if (category && categoryMap[category]) {
                categoryName = ` ${categoryMap[category]}`;
                url = `${rootUrl}/list/${category}.aspx`;
            }
        }

        let crawler = {
            selector: '#jsMainList li',
            callback: ($, i) => {
                let title = $(i).find('h2').text();
                let link = $(i).find('a').attr('href');
                let pubDate = $(i).find('div.date').text();

                return {
                    title,
                    link,
                    image: '',
                    description: '',
                    date: new Date(pubDate),
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

                //let topImage = content('.fullPic').html();
                //item.description = (topImage === null ? '' : topImage) + content('.paragraph').eq(0).html();
                //let description = content('div.artical-content').html();

                return item;
            }
        });

        return {
            title: `${title}${categoryName}`,
            link: url,
            items: items,
        };
    }
}
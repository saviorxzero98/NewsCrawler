import { crawlerHeaders } from '../../../services/httpclient';
import { ServiceContext } from '../../../services/service';
import { NewsCrawler } from '../../newsCrawler';


const rootUrl = 'https://www.taiwanhot.net';
const title = '台灣好新聞';

const categoryMap = {
    '25': '市場快訊',
    '26': '房產頻道',
    '27': '財經頻道',
    '55': '健康頻道',
    '69': '旅遊頻道',
    '70': '生活頻道',
    '80': '政治頻道',
    '131': '社會頻道',
    '161': '地方頻道',

    '56': '台北',
    '72': '新北',
    '53': '新竹',
    '77': '桃園',
    '141': '苗栗',
    '94': '台中',
    '79': '彰化',
    '76': '南投',
    '134': '雲林',
    '135': '嘉義',
    '57': '台南',
    '54': '高雄',
    '137': '屏東',
    '138': '基隆',
    '153': '宜蘭',
    '136': '花蓮',
    '156': '台東',
    '186': '離島',
}


export class TaiwanHotNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNewsByCategory(category: string = '80', count: number = 15) {
        let categoryName = '政治頻道';
        let url = `${rootUrl}/news/focus/80/${encodeURIComponent(categoryName)}`;
        

        if (category && categoryMap[category]) {
            categoryName = categoryMap[category];
            url = `${rootUrl}/news/focus/${category}/${encodeURIComponent(categoryName)}`;
        }

        let crawlers = [
            {
                selector: 'div.main_news',
                callback: ($, i) => {
                    let title = $(i).find('a.post_title h2').text();
                    let link = rootUrl + $(i).find('a.post_title').attr('href');
                    let image = $(i).find('img').attr('src');
                    let description = $(i).find('div.post_content p').text();
                    let pubDate = $(i).find('span.post_time').text();
                    
                    return {
                        title,
                        link,
                        image,
                        description: description,
                        date: new Date(pubDate)
                    };
                }
            },
            {
                selector: 'div.news-item',
                callback: ($, i) => {
                    let title = $(i).find('h4.news-title a').text();
                    let link = $(i).find('h4.news-title a').attr('href');
                    let image = $(i).find('img').attr('src');
                    let description = $(i).find('div.news_content p').text();
                    let pubDate = $(i).find('span.post_time').text();
                    
                    return {
                        title,
                        link,
                        image,
                        description: description,
                        date: new Date(pubDate)
                    };
                }
            }
        ];


        let list = await this.getNewsList({
            url,
            options: crawlerHeaders,
            count,
            crawlers: crawlers
        });


        let items = await this.getNewsDetials({
            list,
            headers: crawlerHeaders,
            callback: (item, content, newsMeta) => {
                item.description = newsMeta.description;
                return item;
            }
        });

        return {
            title: `${title} ${categoryName}`,
            link: rootUrl,
            items: items
        };
    }
}
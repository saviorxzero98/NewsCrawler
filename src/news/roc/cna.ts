import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';
import * as utils from '../../feeds/utils';

const httpClient = axios.default;

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

export class CNANewsCrawler {
    public static async getNews(category: string = 'aall', count: number = 15) {
        let url = '';
        let categoryName = '';
        if (/^\d+$/.test(category)) {
            url = `${rootUrl}/topic/newstopic/${category}.aspx`;
        } 
        else {
            categoryName = ` ${categoryMap[category]}`;
            url = `${rootUrl}/list/${category}.aspx`;
        }
        console.log(`GET ${url}`);

        let response = await httpClient.get(url, utils.crawlerOptions);
        let $ = cheerio.load(response.data);
        let list = $('#jsMainList li')
            .slice(0, count)
            .map((_, item) => {
                let title = $(item).find('h2').text();
                let link = $(item).find('a').attr('href');
                let pubDate = $(item).find('div.date').text();

                return {
                    title,
                    link,
                    image: '',
                    description: '',
                    date:  moment(pubDate, 'yyyy/MM/DD HH:mm').toDate(),
                };
            })
            .get();
            

        let items = await Promise.all(
            list.map(async (item) => {
                let detailResponse = await httpClient.get(item.link, utils.crawlerOptions);
                let content = cheerio.load(detailResponse.data);
                let description = content('meta[property="og:description"]').attr('content');
                let image = content('meta[property="og:image"]').attr('content');
                item.description = description;
                item.image = image;

                //let topImage = content('.fullPic').html();
                //item.description = (topImage === null ? '' : topImage) + content('.paragraph').eq(0).html();
                //let description = content('div.artical-content').html();

                return item;
            })
        );

        return {
            title: `${title}${categoryName}`,
            link: url,
            items: items,
        };
    }
}
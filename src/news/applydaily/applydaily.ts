import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

const httpClient = axios.default;

const rootUrl = 'https://tw.appledaily.com';
const title = '蘋果日報';

export enum AppleDailyNewsPage {
    home = '首頁',
    recommend = '焦點',
    new = '最新',
    hot = '熱門',
    life = '生活',
    entertainment = '娛樂',
    local = '社會',
    property = '財經地產',
    international = '國際',
    politics = '政治',
    gadget = '3C車市',
    supplement = '吃喝玩樂',
    sports = '體育',
    forum = '蘋評理',
    micromovie = '微視蘋',
}

export class AppleDailyNewsCrawler {
    public static async  getNews(page: string = 'home', count: number = 25) {
        let url = `${rootUrl}/${page}`;
        let response = await httpClient.get(url);
        let $ = cheerio.load(response.data);
        let list = $('div.flex-feature')
            .slice(0, count)
            .map((_, item) => {
                let title = $(item).find('span.headline').text();
                let link = rootUrl + $(item).find('a').attr('href');
                let pubDate = moment($(item).find('div.timestamp').text(), 'YYYY/MM/DD HH:mm').format('yyyy-MM-DD HH:mm');

                return {
                    title,
                    link,
                    pubDate,
                };
            })
            .get();

        
        /*
        let items = await Promise.all(
            list.map(async (item) => {
                    const detailResponse = await httpClient.get(item.link);
                    const content = cheerio.load(detailResponse.data);
                    const dataJs = content('script#fusion-metadata').html();
                    const descDataJSON = JSON.parse(dataJs.match(/Fusion.globalContent=(.*);Fusion.globalConte/)[1]);
                    const element = descDataJSON.content_elements;
                    console.log(element);
                    return element;
                } 
            )
        );
        */

        return {
            title: `${title} - ${AppleDailyNewsPage[page]}`,
            link: url,
            item: list,
        };
    }
}
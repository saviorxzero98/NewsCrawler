import { HttpClient, crawlerHeaders } from '../../../services/httpclient';
import { NewsCrawler } from '../../newsCrawler';
import { ServiceContext } from '../../../services/service';

const newsRootUrl = 'https://news.gamebase.com.tw';
const apiRootUrl = 'https://api.gamebase.com.tw';
const title = '遊戲基地';


const typeMap = {
    'game': '遊戲',
    'mobile': '手機遊戲',
    'pc': 'PC遊戲',
    'handheld': 'TV掌機遊戲',
    'pastime': '娛樂',
    'movie': '星聞',
    'tv': '新奇',
    'drama': '影劇',
    'comic': '動漫',
    'casual': '休閒',
    'novel': '小說',
    'technology': '科技新知',
    'r18list': '紳士',
    'fashion': '新鮮話題'
}

export class GamebaseNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(type: string = 'game', count: number = 15) {
        type = this.tryGetMapKey(typeMap, type);
        if (typeMap[type]) {
            let typeName = typeMap[type];
            let url = `${apiRootUrl}/api/news/getNewsList`;
            let data = {
                category: type, 
                page: 1, 
                GB_type: 'newsList'
            };

            if (type === 'r18list') {
                data.GB_type = 'newsPornList';
                data.category = 'all';
            }

            this.services.logger.logPostUrl(url);

            let httpClient = new HttpClient();
            let response = await httpClient.post(url, data, crawlerHeaders);

            if (response.data.return_code === 0) {
                let results = response.data.return_msg.list;
                let list = results.map((item) => ({
                    title: item.news_title,
                    image: item.news_img,
                    description: item.news_content,
                    date: new Date(item.post_time),
                    link: `${newsRootUrl}/news/detail/${item.news_no}`,
                }));

                return {
                    title: `${title} ${typeName}`,
                    link: newsRootUrl,
                    items: list
                };
            }
        }

        return {
            title: `${title}`,
            link: newsRootUrl,
            items: []
        };
    }
}
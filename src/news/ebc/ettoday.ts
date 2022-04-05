import { ServiceContext } from '../../service';
import { NewsCrawler } from '../newsCrawler';


const rootUrl = 'https://www.ettoday.net/';
const rssRootUrl = 'https://feeds.feedburner.com/ettoday';
const title = 'ETtoday'

const rssMap = {
    realtime: '即時',
    news: '政治',
    finance: '財經雲',
    global: '國際',
    china: '中國',
    local: '地方',
    society: '社會',
    lifestyle: '生活',
    health: '健康雲',
    fashion: 'Fashion',
    consuming: '消費',
    house: '房產雲',
    speed: '車雲',
    pet: '寵物雲',
    travel: '旅遊雲',
    star: '星光雲',
    movies: '看電影',
    teck3c: '3C',
    game: '遊戲雲',
    sport: '運動雲',
    novelty: '新奇',
    dalemon: '鍵盤大檸檬',
    commentary: '雲論',
    master: '名家',
    fortune: '運勢',
    photo: '推薦圖集'
}

export class ETtodayNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }
    
    public async getNews(rss: string = 'realtime', count: number = 15) {      
        let list = [];

        if (rssMap[rss]) {
            let url = `${rssRootUrl}/${rss}`;

            let list = await this.getRSSNewsList({
                url,
                count
            });

            return {
                title: `${title} ${rssMap[rss]}`,
                link: rootUrl,
                items: list.slice(0, count),
            };
        }
        
        return {
            title: `${title}`,
            link: '',
            items: list,
        };
    }
}
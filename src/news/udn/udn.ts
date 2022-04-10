import { NewsCrawler } from '../newsCrawler';
import { ServiceContext } from '../../services/service';

const rootUrl = 'https://udn.com';
const starRootUrl = 'https://stars.udn.com';
const healthRootUrl = 'https://health.udn.com';
const globalRootUrl = 'https://global.udn.com';
const gameRootUrl = 'https://game.udn.com';
const opinionRootUrl = 'https://opinion.udn.com/';
const moneyRootUrl = 'https://money.udn.com'

const title = '聯合新聞網';
const starTitle = 'UDN 噓！星聞';
const healthTitle = 'UDN 元氣網';
const globalTitle = 'UDN 轉角國際';
const gameTitle = 'UDN 遊戲角落';
const opinionTitle = 'UDN 名人堂';
const moneyTitle = '經濟日報';

const newsRssMap = {
    'latest': '最新',
    'hottest': '熱門',
    '6638': '要聞',
    '6640': '兩岸',
    '6641': '地方',
    '6643': '評論',
    '6644': '財經',
    '6645': '股市',
    '6656': '政治',
    '6639': '社會',
    '6649': '生活',
    '6999': 'MLB',
    '7002': 'NBA',
    '7225': '國際',
    '7226': '數位',
    '7227': '運動',
    '7240': '產業',
    '7314': '綜合',
    '10930': '軍事',
    '120909': 'Oops',
    '120940': '疫情'
};

const starNewsRssMap = {
    '10088': '熱門星聞',
    '10089': '藝人',
    '10090': '電影',
    '10091': '電視',
    '10092': '音樂',
    '120661': '熱搜',
    '10093': '娛樂有評',
}

const healthNewsRssMap = {
    '5681': '最新',
    '120949': '新冠肺炎',
    '5680': '該看哪科',
    '5683': '癌症',
    '5684': '養生',
    '5686': '性愛',
    '7391': '名人',
    '7732': '活動',
    '10691': '失智',
    '122318': '圖表看健康',
    '122416': '醫聲'
}

const moneyNewsRssMap = {
    '0': '總覽',
    '5588': '國際',
    '5589': '兩岸',
    '5590': '股市',
    '5591': '產業',
    '5592': '理財',
    '5593': '房地產',
    '5595': '觀點',
    '5596': '品味',
    '5597': '商情',
    '10846': '要聞',
    '11111': '期貨',
    '12017': '金融',
    '122327': 'OFF學'
}


export class UDNNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = 'latest', subCategory = '', count: number = 15) {
        let url = '';
        let categoryName = '';
        if (category) {
            if (category === 'latest' || category === 'hottest') {
                url = `${rootUrl}/rssfeed/${category}`;
                categoryName = newsRssMap[category];
            }
            else if (/^\d+$/.test(category)) {
                url =  `${rootUrl}/rssfeed/news/2/${category}`;
                categoryName = newsRssMap[category] || '';

                if (subCategory && /^\d+$/.test(subCategory)) {
                    url = `${url}/${subCategory}`;

                    if (newsRssMap[subCategory]) {
                        categoryName = newsRssMap[subCategory];
                    }
                }
            }
        }

        let list = await this.getRSSNewsList({
            url,
            count
        });

        return {
            title: `${title} ${categoryName}`,
            link: url,
            items: list
        };
    }

    public async getStarNews(category: string = '10088', count: number = 15) {
        let url = '';
        let categoryName = '';
        if (category) {
            if (/^\d+$/.test(category)) {
                url =  `${starRootUrl}/rss/news/1022/${category}`;
                categoryName = starNewsRssMap[category] || '';
            }
        }

        let list = await this.getRSSNewsList({
            url,
            count
        });

        return {
            title: `${starTitle} ${categoryName}`,
            link: url,
            items: list
        };
    }

    public async getHealthNews(category: string = '5681', subCategory = '', count: number = 15) {
        let url = '';
        let categoryName = '';
        if (category && /^\d+$/.test(category)) {
            url =  `${healthRootUrl}/rss/news/1005/${category}`;
                categoryName = healthNewsRssMap[category] || '';

                if (subCategory && /^\d+$/.test(subCategory)) {
                    url = `${url}/${subCategory}`;
                }
        }

        let list = await this.getRSSNewsList({
            url,
            count
        });

        return {
            title: `${healthTitle} ${categoryName}`,
            link: url,
            items: list
        };
    }

    public async getGlobalNews(category: string = '8662', count: number = 15) {
        let url = '';
        if (category) {
            if (/^\d+$/.test(category)) {
                url =  `${globalRootUrl}/rss/news/1020/${category}`;
            }
        }

        let list = await this.getRSSNewsList({
            url,
            count
        });

        return {
            title: `${globalTitle}`,
            link: url,
            items: list
        };
    }

    public async getGameNews(category: string = '', count: number = 15) {
        let url = `${gameRootUrl}/rss/news/2003`;
        if (category) {
            if (/^\d+$/.test(category)) {
                url =  `${gameRootUrl}/rss/news/2003/${category}`;
            }
        }

        let list = await this.getRSSNewsList({
            url,
            count
        });

        return {
            title: `${gameTitle}`,
            link: url,
            items: list
        };
    }

    public async getOpinionNews(category: string = '', count: number = 15) {
        let url = `${opinionRootUrl}/rss/news/1008`;
        if (category) {
            if (/^\d+$/.test(category)) {
                url =  `${opinionRootUrl}/rss/news/1008/${category}`;
            }
        }

        let list = await this.getRSSNewsList({
            url,
            count
        });

        return {
            title: `${opinionTitle}`,
            link: url,
            items: list
        };
    }

    public async getMoneyNews(category: string = '0', count: number = 15) {
        let url = `${moneyRootUrl}/rssfeed/news/1001/0`;
        let categoryName = '';
        if (category) {
            if (/^\d+$/.test(category)) {
                url =  `${moneyRootUrl}/rssfeed/news/1001/${category}`;
                categoryName = moneyNewsRssMap[category];
            }
        }

        let list = await this.getRSSNewsList({
            url,
            count
        });

        return {
            title: `${moneyTitle} ${categoryName}`,
            link: url,
            items: list
        };
    }
}
import { crawlerHeaders } from '../../../services/httpclient';
import { NewsCrawler } from '../../newsCrawler';
import { ServiceContext } from '../../../services/service';

const rootUrls = {
    news: 'https://tw.news.yahoo.com',
    sports: 'https://tw.sports.yahoo.com',
    stock: 'https://tw.stock.yahoo.com'
};
const titles = {
    news: 'Yahoo奇摩新聞',
    sports: 'Yahoo!運動',
    stock: 'Yahoo!股市'
};

const categoryMap = {
    all: '',
    politics: '政治',
    finance: '財經',
    entertainment: '娛樂',
    sports: '運動',
    society: '社會',
    world: '國際',
    lifestyle: '生活',
    health: '健康',
    technology: '科技'
};
const sourceMap = {
    udn: 'udn.com',
    chinatimes: 'chinatimes.com.tw',
    ctee: 'ctee_com_tw_678',
    cna: 'cna.com.tw',
    rti: 'rti.org.tw',
    bcc: 'bcc.com.tw',
    ebc: 'ebc.net.tw',
    ebcfnc: 'ebc__387',
    setn: 'setn.com.tw',
    tvbs: 'news_tvbs_com_tw_938',
    wj: '__60',
    ftvn: 'ftvn.com.tw',
    cts: 'cts.com.tw',
    ttv: 'news_ttv_com_tw_433',
    ctitv: 'gotv_ctitv_com_tw_678',
    mnews: 'mnews_tw_258',
    cw: 'cw.com.tw',
    gvm: 'gvm.com.tw',
    ctwant: 'ctwant_com_582',
    upmedia: 'upmedia.mg.tw',
    mirrormedia: 'mirrormedia.mg',
    nownews: 'nownews.com',
    storm: 'stormmediagroup.com',
    newtalk: 'newtalk.tw',
    taiwanhot: 'taiwanhot.net.tw',
    heho: 'heho_healthy_442',
    healthmedia: 'healthmedia_com_tw_292',
    everydayhealth: 'everydayhealth.com.tw',
    healthgvm: 'health_gvm_252',

    bbc: 'bbc_trad_chinese_tw_489',
    nippon: 'nippon_com_243',
    visionthai: 'visionthai_net_299',
    afp: 'afp.cnanews.gov.tw',
    reuters: 'reuters.com.tw',
    dw: 'www_dw_com_641',

    realnews: 'tw.realnews.yahoo.com',
    news: 'tw.news.yahoo.com',
    global: 'global_videos_163',
    celebrity: 'celebrity.yahoo.tw',
    stock: 'tw.stock.yahoo.com'
};
const sportsMap = {
    'news': '新聞',
    'nba': 'NBA',
    'mlb': 'MLB',
    'cpbl': '中華職棒',
    'npb': '日本職棒',
    'basketball': '籃球',
    'soccer': '足球',
    'golf': '高爾夫',
    'f1': 'F1賽車'
}
const stockMap = {
    'news': '新聞',
    'intl-markets': '國際財經',
    'personal-finance': '理財',
    'funds-news': '基金',
    'column': '專欄',
    'research': '研究'
}

export class YahooNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = 'all', source: string = '', count: number = 15) {
        if (category) {
            if (category.toLowerCase() === 'all') {
                category = '所有類別';
            }
        }
        else {
            category = '所有類別';
        }
        

        let url = `${rootUrls.news}/${encodeURIComponent(category)}/archive`;
        
        if (source) {
            if (sourceMap[this.tryGetMapKey(sourceMap, source)]) {
                source = sourceMap[this.tryGetMapKey(sourceMap, source)];
            }

            url = `${rootUrls.news}/${source}--${encodeURIComponent(category)}/archive`;
        }

        let crawler = {
            selector: 'li.StreamMegaItem div.Cf',
            callback: ($, i) => {
                let title = $(i).find('h3').text().trim();
                let description = $(i).find('p').text();
                let link = rootUrls.news + $(i).find('a').attr('href');
                let image =  $(i).find('img').attr('src') ?? '';

                return {
                    title,
                    link,
                    image: image,
                    description: description,
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
                let pubDate = content('div.caas-attr-time-style time').attr('datetime');
                item.date = new Date(pubDate);
                return item;
            }
        });
         
        return {
            title: `${titles.news} ${categoryMap[category] ?? ''}`,
            link: url,
            items: list
        };
    }

    public async getNewsFromRSS(rss: string = '', count: number = 15) {
        let url = `${rootUrls.news}/rss`;
        if (rss) {
            url = `${url}/${rss}`;
        }

        let { list, title } = await this.getNewsListFromRSS({
            url,
            count
        });

        let items = await this.getNewsDetials({
            list,
            headers: crawlerHeaders,
            callback: (item, content, newsMeta) => {
                item.description = newsMeta.description;
                item.image = newsMeta.image;
                return item;
            }
        });
            
        return {
            title: `${title}`,
            link: rootUrls.news,
            items: items
        };
    }

    public async getSportNews(category: string = '', count: number = 15) {
        let url = `${rootUrls.sports}`;
        let categoryName = '';
        category = this.tryGetMapKey(sportsMap, category);
        if (category && sportsMap[category]) {
            url = `${url}/${category}`;
            categoryName = sportsMap[category];
        }
        url = `${url}/rss`;

        let { list } = await this.getNewsListFromRSS({
            url,
            count
        });

        let items = await this.getNewsDetials({
            list,
            headers: crawlerHeaders,
            callback: (item, content, newsMeta) => {
                item.image = newsMeta.image;
                return item;
            }
        });

        return {
            title: `${titles.sports} ${categoryName}`,
            link: rootUrls.sports,
            items: items
        };
    }

    public async getStockNews(category: string = 'news', count: number = 15) {
        let url = `${rootUrls.stock}/rss?category=news`;
        let categoryName = stockMap['news'];

        category = this.tryGetMapKey(stockMap, category);
        if (category && stockMap[category]) {
            url = `${rootUrls.stock}/rss?category=${category}`;
            categoryName = stockMap[category];
        }

        let { list } = await this.getNewsListFromRSS({
            url,
            count
        });

        return {
            title: `${titles.stock} ${categoryName}`,
            link: rootUrls.sports,
            items: list
        };
    }
}
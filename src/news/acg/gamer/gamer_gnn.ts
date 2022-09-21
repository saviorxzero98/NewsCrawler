import * as cheerio from 'cheerio';

import { HttpClient, crawlerHeaders } from '../../../services/httpclient';
import { NewsCrawler } from '../../newsCrawler';
import { ServiceContext } from '../../../services/service';
import { Item } from 'feed';

const rootUrls = {
    gnn: 'https://gnn.gamer.com.tw',
    acg: 'https://acg.gamer.com.tw'
}

const title = '巴哈姆特';

const categoryMap = {
    '1': 'PC',
    '3': 'TV 掌機',
    '4': '手機遊戲',
    '5': '動漫畫',
    '9': '主題報導',
    '11': '活動展覽',
    '13': '電競'
}

const subcategoryMap = {
    'gba': 'GBA',
    'nds': 'NDS',
    '3ds': '3DS',
    'sfc': 'SFC',
    'ngc': 'NGC',
    'n64': 'N64',
    'wii': 'Wii',
    'wiiu': 'Wii U',
    'ns': 'Switch',
    'ps': 'PS',
    'ps2': 'PS2',
    'ps3': 'PS3',
    'ps4': 'PS4',
    'ps5': 'PS5',
    'psp': 'PSP',
    'psv': 'PSV',   
    'xbox': 'Xbox',
    'xbox360': 'Xbox360',
    'xbone': 'XboxOne',
    'xbsx': 'XboxSX',
    'dc': 'DC',
    'ss': 'SS',
    'pc': 'PC 單機',
    'olg': 'PC 線上',
    'facebook': 'Facebook',
    'arcade': '大型電玩',
    'ios': 'iOS',
    'android': 'Android',
    'web': 'Web 遊戲',
    'comic': '漫畫',
    'anime': '動畫',
    'novel': '小說'
};

export class GamerGNNNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = '', count: number = 15) {
        let url = rootUrls.gnn;
        let categoryName = '';

        category = this.tryGetMapKey(categoryMap, category) || this.tryGetMapKey(subcategoryMap, category)
        if (category) {
            if (categoryMap[category]) {
                url = `${rootUrls.gnn}/index.php?k=${category}`;
                categoryName = categoryMap[category];
            }
            else if (subcategoryMap[category]) {
                url = `${rootUrls.acg}/news.php?p=${category}`;
                categoryName = subcategoryMap[category];
            }
        }

        let crawler = this.getNewsItemCrawler();
        let list = await this.getNewsList({
            url,
            options: crawlerHeaders,
            count,
            crawlers: [ crawler ]
        });

        let items = await this.getNewsDetials({
            list,
            headers: crawlerHeaders,
            callback: async (item, content, newsMeta, response) => {
                let pubDate = '';

                let isBlog = await this.getNewsDetialFromBlog(item, response);
                if (!isBlog) {
                    if (content('span.GN-lbox3C').text() || content('span.GN-lbox3CA').text()) {
                        let report = content('span.GN-lbox3C').text() || content('span.GN-lbox3CA').text();
                        let pubDate = this.parsePubDate(report);
                        item.date = new Date(pubDate);
                    }
                }

                item.description = (newsMeta.description || item.description).replace('繼續閱讀', '');
                item.image = newsMeta.image || item.image;
                return item;
            }
        });

        return {
            title: `${title} ${categoryName}`,
            link: url,
            items: items
        };
    }

    private getNewsItemCrawler() {
        let crawler = {
            selector: 'div.GN-lbox2 div.GN-lbox2B, div.GN-lbox2 div.GN-lbox2F',
            callback: ($, i) => {
                let title = '';
                let link = '';
                let tag = '';
                let description = '';
                let image = '';

                if ($(i).attr('class') === 'GN-lbox2B') {
                    title = $(i).find('h1.GN-lbox2D a').text() || $(i).find('a').text();
                    tag = $(i).find('div.platform-tag_list').text();
                    link = $(i).find('h1.GN-lbox2D a').attr('href') || $(i).find('a').attr('href');
                    description = $(i).find('p.GN-lbox2C').text().trim() || '';
                    image = $(i).find('div.GN-lbox2E a img').attr('src') || '';
                }
                else if ($(i).attr('class') === 'GN-lbox2F') {
                    title = $(i).find('a').text();
                    tag = $(i).find('div.platform-tag_list').text();
                    link = $(i).find('a').attr('href');
                }

                if (tag) {
                    title = `[${tag}] ${title}`;
                }

                return {
                    title,
                    link: link.replace('//', 'https://'),
                    image: image,
                    description: description,
                    date: new Date(),
                };
            }
        };
        return crawler;
    }

    private async getNewsDetialFromBlog(item: Item, response: any) {
        const urlReg = /window.location.replace\('.*'/g;
        
        if (response.data.search(urlReg) < 0) {
            return false;
        }
       
        let newUrl = response.data.match(urlReg)[0].split('(')[1].replace(/'/g, '');

        item = await this.services
                         .cache
                         .tryGet<Item>(newUrl, async () => {
                                try {
                                    let httpClient = new HttpClient();
                                    let newResponse = await  httpClient.get(newUrl, crawlerHeaders);
                                    item.link = newUrl;

                                    const content = cheerio.load(newResponse.data);
                                    if (content('div.MSG-list8C').length > 0) {
                                        let pubInfoText = content('div.BH-lbox span.ST1').text().replace(/\n/g, '');
                                        let pubDate = this.parsePubDate(pubInfoText);
                                        if (pubDate) {
                                            item.date = new Date(pubDate);
                                        }
                                    }
                                    else {
                                        let pubInfoText = content('div.article-intro').text().replace(/\n/g, '');
                                        let pubDate = this.parsePubDate(pubInfoText);
                                        if (pubDate) {
                                            item.date = new Date(pubDate);
                                            
                                        }
                                    }
                                    return item;
                                }
                                catch {
                                    this.services.logger.logError(`Get News Detial Error.`);
                                    return item;
                                }
                            });

        return true;
    }

    private parsePubDate(text: string): string {
        // YYYY-MM-DD HH:mm:ss
        const pattern = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/g;
        let matchList = text.match(pattern);

        if (matchList.length != 0) {
            return matchList[0];
        }
        return '';
    }
}
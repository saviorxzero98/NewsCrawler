import * as moment from 'moment';

import { crawlerHeaders } from '../../services/httpclient';
import { ServiceContext } from '../../services/service';
import { NewsCrawler } from '../newsCrawler';


const rootUrls = {
    home: 'https://www.ettoday.net',
    sports: 'https://sports.ettoday.net',
    game: 'https://game.ettoday.net',
    health: 'https://health.ettoday.net',
    pet: 'https://pets.ettoday.net',
    finance: 'https://finance.ettoday.net',
    star: 'https://star.ettoday.net',
    dalemon: 'https://www.ettoday.net/dalemon'
}
const rssRootUrl = 'https://feeds.feedburner.com/ettoday';
const title = 'ETtoday';

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

const gameMap = {
    '304': '即時新聞',
    '317': '電競新聞',
    '333': '遊戲資訊',
    '468': '動漫ACG'
}

const dalemonCollectionMap = {
    '2': '奇聞',
    '5': '感情',
    '7': '宅玩',
    '8': '萌獸',
    '10': '潮流',
    '11': '運勢',
    '13': '驚悚',
    '14': '開酸',
    '15': '長腦',
    '16': '打卡'
}

export class ETtodayNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }
    
    public async getNews(rss: string = 'realtime', count: number = 15) {      
        let list = [];

        rss = this.tryGetMapKey(rssMap, rss);
        if (rss && rssMap[rss]) {
            let url = `${rssRootUrl}/${rss}`;

            let { list } = await this.getNewsListFromRSS({
                url,
                count
            });

            return {
                title: `${title} ${rssMap[rss]}`,
                link: rootUrls.home,
                items: list,
            };
        }
        
        return {
            title: `${title}`,
            link: rootUrls.home,
            items: list,
        };
    }

    public async getSportsNews(category: string = '新聞', subcategory: string = '最新新聞', count: number = 15) {
        let url = '';

        if (category && subcategory) {
            url = `${rootUrls.sports}/news-list/${encodeURIComponent(category)}/${encodeURIComponent(subcategory)}`;
        }
        else {
            category = '新聞';
            subcategory = '最新新聞';
            url = `${rootUrls.sports}/news-list/${encodeURIComponent(category)}/${encodeURIComponent(subcategory)}`;
        }

        let crawler = {
            selector: 'div.c1 div.block_content div.clearfix',
            callback: ($, i) => {
                let title = $(i).find('h3').text();
                let link = rootUrls.sports + $(i).find('h3 a').attr('href');
                let image = $(i).find('img').attr('data-original');
                let description = $(i).find('p.summary').text();
                let pubDate = $(i).find('span.date').text();
                
                return {
                    title,
                    link,
                    image,
                    description: description,
                    date: new Date(pubDate)
                };
            }
        };
        let list = await this.getNewsList({
            url,
            options: crawlerHeaders,
            count,
            crawlers: [ crawler ]
        });
 
        return {
            title: `${title}運動雲 ${subcategory}`,
            link: url,
            items: list,
        };
    }

    public async getGameNews(topic: string = '304', count: number = 15) {
        let url = `${rootUrls.game}/focus-2.php?topicId=304`;
        let topicName = '';

        if (topic && gameMap[topic]) {
            url = `${rootUrls.game}/focus-2.php?topicId=${topic}`;
            topicName = gameMap[topic];
        }

        let crawler = {
            selector: 'div.c1 div.clearfix',
            callback: ($, i) => {
                let title = $(i).find('h3 a').text();
                //let link = rootUrls.game + $(i).find('h3 a').attr('href');
                let link = $(i).find('h3 a').attr('href');
                let image = $(i).find('img').attr('data-original');
                let pubDate = $(i).find('span.date').text();
                $(i).find('span.date').remove();
                let description = $(i).find('p').text();
                
                return {
                    title,
                    link,
                    image,
                    description: description,
                    date: moment(pubDate, '(YYYY-MM-DD HH:mm:ss)').toDate()
                };
            }
        };
        let list = await this.getNewsList({
            url,
            options: crawlerHeaders,
            count,
            crawlers: [ crawler ]
        });
 
        return {
            title: `${title}遊戲雲 ${topicName}`,
            link: url,
            items: list,
        };
    }

    public async getHealthNews(category: string = 'lastnews', tag: string = '', count: number = 15) {
        let url = `${rootUrls.health}/lastnews`;
        let categoryName = '';

        if (category && category !== 'lastnews') {
            if (tag) {
                url = `${rootUrls.health}/category_tag/${encodeURIComponent(tag)}`;
                categoryName = tag;
            }
            else {
                url = `${rootUrls.health}/category/${encodeURIComponent(category)}`;
                categoryName = category;
            }
        }

        let crawler = {
            selector: 'div.c1 div.clearfix',
            callback: ($, i) => {
                let title = $(i).find('h3 a').text();
                let link = $(i).find('h3 a').attr('href');
                let image = $(i).find('img').attr('data-original');
                let description = $(i).find('p.summary').text();
                let pubDate = $(i).find('span.date').attr('content');
                
                return {
                    title,
                    link,
                    image,
                    description: description,
                    date: new Date(pubDate)
                };
            }
        };
        let list = await this.getNewsList({
            url,
            options: crawlerHeaders,
            count,
            crawlers: [ crawler ]
        });
 
        return {
            title: `${title}健康雲 ${categoryName}`,
            link: url,
            items: list,
        };
    }

    public async getPetNews(category: string = '新聞總覽', count: number = 15) {
        let url = `${rootUrls.pet}/focus/${encodeURIComponent(category)}`;

        let crawler = {
            selector: 'div.c1 div.clearfix',
            callback: ($, i) => {
                let title = $(i).find('h3 a').text();
                let link = $(i).find('h3 a').attr('href');
                let image = $(i).find('img').attr('data-original');
                let description = $(i).find('p.summary').text();
                
                return {
                    title,
                    link,
                    image,
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
                item.description = newsMeta.description;
                item.image = newsMeta.image;
                if (newsMeta.pubDate) {
                    item.date = new Date(newsMeta.pubDate);
                }
                return item;
            }
        });
 
        return {
            title: `${title}寵物雲 ${category}`,
            link: url,
            items: items,
        };
    }


    public async getDalemonNews(count: number = 15) {
        return await this.getNews('dalemon', count);
    }

    public async getDalemonNewsByCollection(collection: string, count: number = 15) {
        if (collection && 
            dalemonCollectionMap[collection]) {
            let url = `${rootUrls.dalemon}/collection/${collection}`;

            let crawler = {
                selector: 'div.topic-page div.clearfix',
                callback: ($, i) => {
                    let title = $(i).find('h3 a').text();
                    let link = $(i).find('h3 a').attr('href');
                    let image = $(i).find('img').attr('data-original');
                    let description = $(i).find('p.summary').text();
                    let pubDate = $(i).find('span[itemprop="datePublished"]').attr('content');
                    
                    return {
                        title,
                        link,
                        image,
                        description: description,
                        date: new Date(pubDate)
                    };
                }
            };
            let list = await this.getNewsList({
                url,
                options: crawlerHeaders,
                count,
                crawlers: [ crawler ]
            });
     
            return {
                title: `${title}鍵盤大檸檬 ${dalemonCollectionMap[collection]}`,
                link: url,
                items: list,
            };
        }
        else {
            return await this.getDalemonNews(count);
        }
    }

    public async getDalemonNewsByTag(tag: string, count: number = 15) {
        if (tag) {
            let url = `${rootUrls.dalemon}/tag/${encodeURIComponent(tag)}`;
            let crawler = {
                selector: 'div.tag-page div.clearfix',
                callback: ($, i) => {
                    let title = $(i).find('h3 a').text();
                    let link = $(i).find('h3 a').attr('href');
                    let image = $(i).find('img').attr('data-original');
                    let description = $(i).find('p.summary').text();
                    let pubDate = $(i).find('span[itemprop="datePublished"]').attr('content');
                    
                    return {
                        title,
                        link,
                        image,
                        description: description,
                        date: new Date(pubDate)
                    };
                }
            };
            let list = await this.getNewsList({
                url,
                options: crawlerHeaders,
                count,
                crawlers: [ crawler ]
            });
     
            return {
                title: `${title}鍵盤大檸檬 ${tag}`,
                link: url,
                items: list,
            };
        }
        else {
            return await this.getDalemonNews(count);
        }
    }

    public async getDalemonNewsByEditor(editor: string, count: number = 15) {
        if (editor && 
            /^\d+$/.test(editor)) {
            let url = `${rootUrls.dalemon}/editor-news/${editor}`;
            let editorName = '';
            
            let crawler = {
                selector: 'div.editor-news-page div.clearfix',
                callback: ($, i) => {
                    let title = $(i).find('h3 a').text();
                    let link = $(i).find('h3 a').attr('href');
                    let description = $(i).find('p.summary').text();
                    editorName = $('div.subject_editor h4').text();

                    return {
                        title,
                        link,
                        image: '',
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
                    item.image = newsMeta.image ?? item.image;
                    item.date = newsMeta.pubDate;
   
                    return item;
                }
            });
     
            return {
                title: `${title}鍵盤大檸檬 ${editorName}`,
                link: url,
                items: items,
            };
        }
        else {
            return await this.getDalemonNews(count);
        }
    }
}
import { crawlerHeaders } from '../../../../services/httpclient';
import { ServiceContext } from '../../../../services/service';
import { NewsCrawler } from '../../../newsCrawler';

const languageMap = {
    'en-us': {
        rootUrl: 'https://feeds.a.dj.com/rss',
        title: 'The Wall Street Journal',
        rssMap: {
            market: {
                rss: 'RSSMarketsMain.xml',
                name: 'Markets'
            },
            bussiness: {
                rss: 'WSJcomUSBusiness.xml',
                name: 'Business'
            },
            technology: {
                rss: 'RSSWSJD.xml',
                name: 'Technology'
            },
            world: {
                rss: 'RSSWorldNews.xml',
                name: 'World'
            },
            opinion: {
                rss: 'RSSOpinion.xml',
                name: 'Opinion'
            },
            lifestyle: {
                rss: 'RSSLifestyle.xml',
                name: 'Lifestyle'
            },
        }
    },
    'zh-hans': {
        rootUrl: 'https://cn.wsj.com/zh-hans/rss',
        title: '华尔街日报',
        rssMap: {
            news: {
                rss: '',
                name: ''
            }
        }
    },
    'zh-hant': {
        rootUrl: 'https://cn.wsj.com/zh-hant/rss',
        title: '華爾街日報',
        rssMap: {
            news: {
                rss: '',
                name: ''
            }
        }
    },
    'ja-jp': {
        rootUrl: 'https://feeds.a.dj.com/rss',
        title: 'The Wall Street Journal',
        rssMap: {
            market: {
                rss: 'RSSJapanMarket.xml',
                name: 'マーケット'
            },
            heardon_the_street: {
                rss: 'RSSJapanHeardonTheStreet.xml',
                name: 'Heard on the Street'
            },
            bussiness: {
                rss: 'RSSJapanBusiness.xml',
                name: 'ビジネス'
            },
            technology: {
                rss: 'RSSJapanTechnology.xml',
                name: 'テクノロジー'
            },
            personal_technology: {
                rss: 'RSSJapanPersonalTechnology.xml',
                name: 'パーソナルテクノロジー'
            },
            world: {
                rss: 'RSSJapanNewsWorld.xml',
                name: '国際'
            },
            capital_journal: {
                rss: 'RSSJapanCapitalJournal.xml',
                name: 'Capital Journal'
            },
            opinion: {
                rss: 'RSSJapanOpinion.xml',
                name: 'オピニオン'
            },
            life: {
                rss: 'RSSJapanLife.xml',
                name: 'ライフ'
            },
            barrons: {
                rss: 'RSSJapanBarrons.xml',
                name: 'バロンズ'
            }
        }
    }
}

export class WSJNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }
    public async getNews(category: string = '',  language: string = 'zh-hant', count: number = 15) 
    {
        language = this.getLanguage(language);
        let mapInfo = languageMap[language];
        let title = mapInfo.title;
        let rootUrl = mapInfo.rootUrl;
        let rssInfo = mapInfo.rssMap[category] ?? Object.values(mapInfo.rssMap)[0];
        let url = `${rootUrl}/${rssInfo.rss}`;
        let categoryName = rssInfo.name ?? '';

        let { list } = await this.getNewsListFromRSS({
            url,
            count
        });

        if (language === 'ja-jp' || language === 'en-us') {
            let items = await this.getNewsDetials({
                list,
                headers: crawlerHeaders,
                callback: (item, content, newsMeta) => {
                    //item.description = newsMeta.description;
                    item.image = newsMeta.image ?? item.image;
                    return item;
                }
            });

            return {
                title: `${title} ${categoryName}`,
                link: url,
                items: items,
            };
        }

        return {
            title: `${title} ${categoryName}`,
            link: url,
            items: list,
        };
    }

    private getLanguage(language: string = 'zh-hant') {
        if (language) {
            language = language.toLowerCase();
            
            if (language.startsWith('en')) {
                return 'en-us';
            }
            
            switch (language) {
                case 'cn':
                case 'zh-cn':
                case 'zh-sg':
                case 'zh-my':
                case 'zh-hans':
                    return 'zh-hans';

                case 'zh':
                case 'tw':
                case 'hk':
                case 'zh-tw':
                case 'zh-hk':
                case 'zh-mo':
                case 'zh-hant':
                    return 'zh-hant';

                case 'jp':
                case 'ja':
                case 'ja-jp':
                    return 'ja-jp';
            }
        }
        return 'zh-hant';
    }
}
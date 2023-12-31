import { crawlerHeaders } from '../../../../services/httpclient';
import { ServiceContext } from '../../../../services/service';
import { NewsCrawler } from '../../../newsCrawler';

const languageMap = {
    'en-us': {
        rootUrl: 'https://rss.nytimes.com/services/xml/rss/nyt',
        title: 'The New York Times',
        rssMap: {
            homepage: {
                rss: 'HomePage.xml',
                name: 'Home Page'
            },
            world: {
                rss: 'World.xml',
                name: 'World'
            },
            africa: {
                rss: 'Africa.xml',
                name: 'Africa'
            },
            americas: {
                rss: 'Americas.xml',
                name: 'Americas'
            },
            asiapacific: {
                rss: 'AsiaPacific.xml',
                name: 'Asia Pacific'
            },
            europe: {
                rss: 'Europe.xml',
                name: 'Europe'
            },
            us: {
                rss: 'US.xml',
                name: 'U.S.'
            },
            education: {
                rss: 'Education.xml',
                name: 'Education'
            },
            politics: {
                rss: 'Politics.xml',
                name: 'Politics'
            },
            upshot: {
                rss: 'Upshot.xml',
                name: 'The Upshot'
            },
            nyRegion: {
                rss: 'NYRegion.xml',
                name: 'NYRegion'
            },
            business: {
                rss: 'Business.xml',
                name: 'Business'
            },
            energyenvironment: {
                rss: 'EnergyEnvironment.xml',
                name: 'Energy & Environment'
            },
            smallbusiness: {
                rss: 'SmallBusiness.xml',
                name: 'Small Business'
            },
            economy: {
                rss: 'Economy.xml',
                name: 'Economy'
            },
            dealbook: {
                rss: 'DealBook.xml',
                name: 'DealBook'
            },
            mediaandadvertising: {
                rss: 'MediaandAdvertising.xml',
                name: 'Media & Advertising'
            },
            yourmoney: {
                rss: 'YourMoney.xml',
                name: 'Your Money'
            },
            technology: {
                rss: 'Technology.xml',
                name: 'Technology'
            },
            personaltech: {
                rss: 'PersonalTech.xml',
                name: 'Personal Tech'
            },
            sports: {
                rss: 'Sports.xml',
                name: 'Sports'
            },
            baseball: {
                rss: 'Baseball.xml',
                name: 'Baseball'
            },
            collegebasketball: {
                rss: 'CollegeBasketball.xml',
                name: 'College Basketball'
            },
            collegefootball: {
                rss: 'CollegeFootball.xml',
                name: 'College Football'
            },
            golf: {
                rss: 'Golf.xml',
                name: 'Golf'
            },
            hockey: {
                rss: 'Hockey.xml',
                name: 'Hockey'
            },
            probasketball: {
                rss: 'ProBasketball.xml',
                name: 'Pro-Basketball'
            },
            profootball: {
                rss: 'ProFootball.xml',
                name: 'Pro-Football'
            },
            soccer: {
                rss: 'Soccer.xml',
                name: 'Soccer'
            },
            tennis: {
                rss: 'Tennis.xml',
                name: 'Tennis'
            },
            science: {
                rss: 'Science.xml',
                name: 'Science'
            },
            environment: {
                rss: 'Environment.xml',
                name: 'Environment'
            },
            space: {
                rss: 'Space.xml',
                name: 'Space & Cosmos'
            },
            health: {
                rss: 'health.xml',
                name: 'Health'
            },
            well: {
                rss: 'Well.xml',
                name: 'Well Blog'
            }
        }
    },
    'zh-hans': {
        rootUrl: 'https://cn.nytimes.com/rss',
        title: '纽约时报中文网',
        rssMap: {
            news: {
                rss: '',
                name: ''
            }
        }
    },
    'zh-hant': {
        rootUrl: 'https://cn.nytimes.com/rss/zh-hant',
        title: '紐約時報中文網',
        rssMap: {
            news: {
                rss: '',
                name: ''
            }
        }
    }
}

export class NYTimesNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = '',  language: string = 'zh-hant', count: number = 15)  {
        language = this.getLanguage(language);
        let mapInfo = languageMap[language];
        let title = mapInfo.title;
        let rootUrl = mapInfo.rootUrl;
        let rssInfo: any;

        category = this.tryGetMapKey(mapInfo.rssMap, category);
        if (category && mapInfo.rssMap[category]) {
            rssInfo = mapInfo.rssMap[category];
        }
        else {
            rssInfo = Object.values(mapInfo.rssMap)[0];
        }
        
        let url = `${rootUrl}/${rssInfo.rss}`;

        let { list } = await this.getNewsListFromRSS({
            url,
            count
        });

        if (language === 'en-us') {
            let categoryName = rssInfo.name ?? '';
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
            title: `${title}`,
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
            }
        }
        return 'zh-hant';
    }
}
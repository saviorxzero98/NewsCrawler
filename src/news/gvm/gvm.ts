import * as moment from 'moment';

import { ServiceContext } from '../../services/service';
import * as utils from '../../feeds/utils';
import { NewsCrawler } from '../newsCrawler';


const rootUrl = 'https://www.gvm.com.tw';
const title = '遠見雜誌';

const categoryMap = {
    newest: '最新文章',
    recommend: '你可能會喜歡',
    opinion: '名家專欄',
    topic: '專題',
    news: '時事熱點',
    politics: '政治',
    society: '社會',
    figure: '人物報導',
    world: '國際',
    world_focus: '全球焦點',
    cross_strait_politics: '兩岸',
    money: '金融理財',
    investment: '投資理財',
    insurance: '保險規劃',
    retire: '退休理財',
    fintech: '金融Fintech',
    real_estate: '房地產',
    economy: '總體經濟',
    tech: '科技',
    tech_trend: '科技趨勢',
    energy: '能源',
    business: '產經',
    industry: '傳產',
    service: '消費服務',
    medical: '生技醫藥',
    family_business_succession: '傳承轉型',
    startup: '創業新創',
    management: '管理',
    agriculture: '農業',
    education: '教育',
    higher_education: '高教',
    technological: '技職',
    parent: '親子教育',
    world_education: '國際文教',
    sports: '體育',
    life: '好享生活',
    art: '時尚設計',
    self_growth: '心靈成長',
    film: '藝文影視',
    travel: '旅遊',
    environment: '環境生態',
    health: '健康',
    food: '美食',
    career: '職場生涯',
    survey: '調查',
    county: '縣市',
    csr: 'CSR',
};

export class GVMNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(category: string = 'newest', count: number = 15) {
        let url = `${rootUrl}/${category}`;
        let categoryName = categoryMap[category];
        if (category !== 'newest' && category !== 'recommend') {
            url = `${rootUrl}/category/${category}`;
        }

        
        let crawler = {
            selector: 'div#article_list div.article-list-item',
            callback: ($, i) => {
                let title = $(i).find('div.article-list-item__intro h3').text();
                let description = $(i).find('div.article-list-item__intro p.article-list-item__summary').text();
                let image = $(i).find('div.article-list-item__img img').attr('data-original');
                let link = $(i).find('div.article-list-item__intro a').attr('href');
                let date = new Date($('div.article-list-item__intro div.article-list-item__data div.time', i).text())
                return {
                    title,
                    link,
                    image: image,
                    description: description,
                    date: date
                };
            }
        };

        let list = await this.getNewsList({
            url,
            options: utils.crawlerOptions,
            count,
            crawlers: [ crawler ]
        });

        return {
            title: `${title} ${categoryName}`,
            link: url,
            items: list,
        };
    }
}
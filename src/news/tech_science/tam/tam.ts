import { HttpClient, crawlerHeaders } from '../../../services/httpclient';
import { NewsCrawler } from '../../newsCrawler';
import { ServiceContext } from '../../../services/service';

const rootUrl = 'https://www.tam.gov.taipei';
const apiRootUrl = 'https://www.tam.gov.taipei/OpenData.aspx?SN=9B70FA1EEE3AED84';
const title = '臺北市天文科學教育館';

export class TAMNewsCrawler extends NewsCrawler {
    constructor(services: ServiceContext) {
        super(services);
    }

    public async getNews(count: number = 15) {
        let url = apiRootUrl;

        this.services.logger.logGetUrl(url);

        try {
            let httpClient = new HttpClient();
            let response = await httpClient.get(url, crawlerHeaders);
            let results = response.data;

            if (results && Array.isArray(results)) {
                let list = results.map((item) => {
                    let image = '';

                    if (item['相關圖片'] && 
                        Array.isArray(item['相關圖片']) &&
                        item['相關圖片'].length !== 0) {
                        image = item['相關圖片'][0].url;
                    }
                    
                    return {
                        title: item['title'],
                        image: image,
                        description: item['內容'],
                        date: new Date(item['上版日期']),
                        link: item['Source'],
                    }
                });

                return {
                    title: `${title}`,
                    link: rootUrl,
                    items: list.slice(0, count)
                };
            }
        }
        catch {
            this.services.logger.logError(`Get News '${url}' Error`);
        }

        return {
            title: `${title}`,
            link: rootUrl,
            items: []
        };
    }
}
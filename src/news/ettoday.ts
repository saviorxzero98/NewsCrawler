import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as moment from 'moment';
import { read } from 'feed-reader';

const httpClient = axios.default;

const rootUrl = 'https://www.ettoday.net/';
const rssRootUrl = 'https://feeds.feedburner.com/ettoday';
const title = 'ETtoday'

const rssMap = {
    realtime: '即時',
    global: '國際',
    local: '地方',
    china: '中國',

}


export class ETtodayNewsCrawler {
    public static async  getNews(rss: string = 'realtime', count: number = 25) {
        
        if (rssMap[rss]) {
            let url = `${rssRootUrl}/${rss}`;
            let data = await read(url)

            return {
                title: `${title} ${rssMap[rss]}`,
                link: rootUrl,
                item: data.entries.slice(0, count),
            };
        }
        
        return {
            title: `${title}`,
            link: '',
            item: [],
        };
    }
}
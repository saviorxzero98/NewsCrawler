import { AppleDailyNewsCrawler } from './news/applydaily';
import { ChinaTimesNewsCrawler } from './news/chinatimes';
import { CTSNewsCrawler } from './news/cts';
import { ERANewsCrawler } from './news/era';
import { FTVNewsCrawler } from './news/ftvnews';
import { NBATaiwanNewsCrawler } from './news/udn_nba';
import { NextTVNewsCrawler } from './news/nexttv';
import { NownewsNewsCrawler } from './news/nownews';
import { SETNewsCrawler } from './news/setn';
import { TTVNewsCrawler } from './news/ttv';
import { TVBSNewsCrawler } from './news/tvbs';


async function print() {
    let news = await NBATaiwanNewsCrawler.getNews();
    console.log(news);
}

print();

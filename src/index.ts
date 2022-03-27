import { AppleDailyNewsCrawler } from './news/applydaily';
import { ChinaTimesNewsCrawler } from './news/chinatimes';
import { CNANewsCrawler } from './news/cna';
import { CTSNewsCrawler } from './news/cts';
import { EBCNewsCrawler } from './news/ebc';
import { EBCFncNewsCrawler } from './news/ebc_fnc';
import { ERANewsCrawler } from './news/era';
import { FTVNewsCrawler } from './news/ftvnews';
import { NTDTVTwNewsCrawler } from './news/ntdtv_tw';
import { NBATaiwanNewsCrawler } from './news/nba_tw';
import { NewtalkNewsCrawler } from './news/newtalk';
import { NextTVNewsCrawler } from './news/nexttv';
import { NownewsNewsCrawler } from './news/nownews';
import { SETNewsCrawler } from './news/setn';
import { TTVNewsCrawler } from './news/ttv';
import { TVBSNewsCrawler } from './news/tvbs';
import { RtiNewsCrawler } from './news/rti';


async function print() {
    let news = await NewtalkNewsCrawler.getNews();
    console.log(news);
}

print();

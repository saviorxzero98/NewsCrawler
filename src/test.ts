import NodeCache = require("node-cache");
import { ServiceContext } from "./service";

import { AppleDailyNewsCrawler } from './news/applydaily/applydaily';
import { ChinaTimesNewsCrawler } from './news/chinatimes/chinatimes';
import { CNANewsCrawler } from './news/roc/cna';
import { CTSNewsCrawler } from './news/tbs/cts';
import { EBCNewsCrawler } from './news/ebc/ebc';
import { EBCFncNewsCrawler } from './news/ebc/ebc_fnc';
import { ERANewsCrawler } from './news/next_era/era';
import { ETtodayNewsCrawler } from './news/ebc/ettoday';
import { FTVNewsCrawler } from './news/ftv/ftvnews';
import { NTDTVTwNewsCrawler } from './news/ntdtv/ntdtv_tw';
import { NBATaiwanNewsCrawler } from './news/udn/nba_tw';
import { NewtalkNewsCrawler } from './news/newtalk/newtalk';
import { NextTVNewsCrawler } from './news/next_era/nexttv';
import { NownewsNewsCrawler } from './news/nownews/nownews';
import { SETNewsCrawler } from './news/setn/setn';
import { TTVNewsCrawler } from './news/ttv/ttv';
import { TVBSNewsCrawler } from './news/tvbs/tvbs';
import { RtiNewsCrawler } from './news/roc/rti';
import { WorldJournalNewsCrawler } from './news/udn/worldjournal';
import { HealthMediaNewsCrawler } from './news/heath/healthmedia';
import { MirrorMediaNewsCrawler } from './news/mirrormedia/mirrormedia';
import { CtwantNewsCrawler } from "./news/chinatimes/ctwant";
import { LTNNewsCrawler } from "./news/ltn/ltn";

const cache = new NodeCache();

export const testCrawlNews = async () => {
    let services = new ServiceContext().registCache(cache);

    let crawler = new LTNNewsCrawler(services);
    let news = await crawler.getNews();
    console.log(news);
}
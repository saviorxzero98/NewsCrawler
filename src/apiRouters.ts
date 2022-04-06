import { AppleDailyNewsRouter } from './news/applydaily/router';
import { ChinaTimesNewsRouter } from './news/chinatimes/router';
import { EBCNewsRouter } from './news/ebc/router';
import { FTVNewsNewsRouter } from './news/ftv/router';
import { TBSNewsRouter } from './news/tbs/router';
import { TTVNewsRouter } from './news/ttv/router';
import { RocGovNewsRouter } from './news/roc/router';
import { TVBSNewsRouter } from './news/tvbs/router';
import { SETNewsRouter } from './news/setn/router';
import { NextEraNewsRouter } from './news/next_era/router';
import { NownewsNewsRouter } from './news/nownews/router';
import { NewtalkNewsRouter } from './news/newtalk/router';
import { UDNNewsRouter } from './news/udn/router';
import { ServiceContext } from "./services/service";
import { MirrorMediaNewsNewsRouter } from './news/mirrormedia/router';
import { NTDTVNewsRouter } from './news/ntdtv/router';
import { HeathNewsRouter } from './news/heath/router';
import { LTNNewsRouter } from './news/ltn/router';
import { ACGNewsRouter } from './news/acg/router';

export const addRouters = (services: ServiceContext) => {

    // ACG 新聞 (巴哈姆特、4Gammer、QooApp)
    ACGNewsRouter.router(services);

    // 蘋果日報
    AppleDailyNewsRouter.router(services);
    
    // 中國時報 (中時電子報、工商時報、CTWANT)
    ChinaTimesNewsRouter.router(services);

    // 民視新聞
    FTVNewsNewsRouter.router(services);

    // 東森電視 (東森新聞、東森財經新聞、ETtoday)
    EBCNewsRouter.router(services);

    // 健康相關新聞 (NOW健康)
    HeathNewsRouter.router(services);

    // 自由時報
    LTNNewsRouter.router(services);

    // 鏡周刊
    MirrorMediaNewsNewsRouter.router(services);

    // 新頭殼
    NewtalkNewsRouter.router(services);

    // 年代電視 (年代新聞、壹電視新聞)
    NextEraNewsRouter.router(services);

    // Nownews 今日新聞
    NownewsNewsRouter.router(services);

    // 新唐人電視台
    NTDTVNewsRouter.router(services);

    // 中華民國官方媒體 (中央通訊社CNA、Rti中央廣播電台)
    RocGovNewsRouter.router(services);

    // 三立新聞
    SETNewsRouter.router(services);

    // 公廣集團 (華視新聞、公視新聞)
    TBSNewsRouter.router(services);
    
    // 非凡集團 (台視新聞)
    TTVNewsRouter.router(services);

    // 聯利集團 (TVBS新聞)
    TVBSNewsRouter.router(services);

    // 聯合報 (聯合新聞、NBA台灣、世界新聞網)
    UDNNewsRouter.router(services);
}
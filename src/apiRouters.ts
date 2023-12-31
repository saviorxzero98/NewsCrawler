import { ServiceContext } from "./services/service";

import { AppleDailyNewsRouter } from './news/applydaily/router';
import { ChinaTimesNewsRouter } from './news/chinatimes/router';
import { EBCNewsRouter } from './news/ebc/router';
import { FTVNewsNewsRouter } from './news/ftv/router';
import { TBSNewsRouter } from './news/tbs/router';
import { TTVNewsRouter } from './news/ttv/router';
import { TVBSNewsRouter } from './news/tvbs/router';
import { SETNewsRouter } from './news/setn/router';
import { NextEraNewsRouter } from './news/next_era/router';
import { NownewsNewsRouter } from './news/nownews/router';
import { NewtalkNewsRouter } from './news/newtalk/router';
import { UDNNewsRouter } from './news/udn/router';
import { HeathNewsRouter } from './news/heath/router';
import { LTNNewsRouter } from './news/ltn/router';
import { ACGNewsRouter } from './news/acg/router';
import { BCCNewsRouter } from './news/bccnews/router';
import { StormNewsRouter } from './news/storm/router';
import { SportNewsRouter } from './news/sport/router';
import { WorldNewsRouter } from './news/world/router';
import { MagazineNewsRouter } from './news/magazine/router';
import { CollectionNewsRouter } from "./news/collection/router";
import { TechAndScienceNewsRouter } from "./news/tech_science/router";
import { OthersNewsRouter } from "./news/others/router";
import { MirrorMediaNewsNewsRouter } from "./news/mirrormedia/router";

export const addRouters = (services: ServiceContext) => {

    // ACG 新聞 (巴哈姆特、4Gammer、QooApp)
    ACGNewsRouter.router(services);

    // 蘋果日報
    AppleDailyNewsRouter.router(services);
    
    // 中國廣播電台 (中廣新聞網)
    BCCNewsRouter.router(services);

    // 中國時報 (中時電子報、工商時報、CTWANT)
    ChinaTimesNewsRouter.router(services);

    // 新聞彙集平台 (Yahoo新聞、Yam 新聞、PCHome 新聞、Hinet 新聞、新浪新聞)
    CollectionNewsRouter.router(services);

    // 東森電視 (東森新聞、東森財經新聞、ETtoday)
    EBCNewsRouter.router(services);

    // 民視新聞
    FTVNewsNewsRouter.router(services);

    // 健康相關新聞 (NOW健康)
    HeathNewsRouter.router(services);

    // 自由時報
    LTNNewsRouter.router(services);

    // 雜誌類 (遠見雜誌、天下雜誌)
    MagazineNewsRouter.router(services);

    // 鏡傳媒 (鏡周刊、鏡新聞)
    MirrorMediaNewsNewsRouter.router(services);

    // 新頭殼
    NewtalkNewsRouter.router(services);

    // 年代電視 (年代新聞、壹電視新聞)
    NextEraNewsRouter.router(services);

    // Nownews 今日新聞
    NownewsNewsRouter.router(services);

    // 其他新聞
    OthersNewsRouter.router(services);

    // 三立新聞
    SETNewsRouter.router(services);

    // 體育新聞 (運動視界)
    SportNewsRouter.router(services);

    // 風傳媒
    StormNewsRouter.router(services);

    // 公廣集團 (華視新聞、公視新聞、中央通訊社CNA、Rti中央廣播電台)
    TBSNewsRouter.router(services);
    
    // 科技3C、科學新聞
    TechAndScienceNewsRouter.router(services);

    // 非凡集團 (台視新聞)
    TTVNewsRouter.router(services);

    // 聯利集團 (TVBS新聞)
    TVBSNewsRouter.router(services);

    // 聯合報 (聯合新聞、NBA台灣、世界新聞網)
    UDNNewsRouter.router(services);

    // 外國媒體
    WorldNewsRouter.router(services);
}
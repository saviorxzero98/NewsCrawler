import { ServiceContext } from "../../../services/service";
import { NowNewsRouter } from "./now/router";
import { RTHKNewsRouter } from "./rthk/router";
import { InitiumNewsRouter } from "./initium/router";
import { MingPaoNewsRouter } from "./mingpao/router";
import { InmediahkNewsRouter } from "./inmediahk/router";
import { HKETNewsRouter } from "./hket/router";
import { BastillePostNewsRouter } from "./bastillepost/router";
import { OrientalDailyNewsRouter } from "./orientaldaily/router";
import { HK01NewsRouter } from "./hk01/router";

export class HongKongNewsRouter {
    public static router(services: ServiceContext) {
        // 巴士的報
        BastillePostNewsRouter.router(services);
        
        // 香港01
        HK01NewsRouter.router(services);

        // 香港經濟日報
        HKETNewsRouter.router(services);

        // 端傳媒
        InitiumNewsRouter.router(services);

        // 獨立媒體
        InmediahkNewsRouter.router(services);

        // 明報
        MingPaoNewsRouter.router(services);

        // NOW新聞
        NowNewsRouter.router(services);

        // 東方日報
        OrientalDailyNewsRouter.router(services);

        // 香港電台
        RTHKNewsRouter.router(services);
    }
}
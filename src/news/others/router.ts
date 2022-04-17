import { ServiceContext } from "../../services/service";

import { MeritTimesNewsRouter } from "./merittimes/router";
import { TaiwanHotNewsRouter } from "./taiwanhot/router";

export class OthersNewsRouter {
    public static router(services: ServiceContext) {
        // 人間福報
        MeritTimesNewsRouter.router(services);

        // 台灣好新聞
        TaiwanHotNewsRouter.router(services);
    }
}
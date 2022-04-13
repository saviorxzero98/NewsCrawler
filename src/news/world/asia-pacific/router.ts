import { ServiceContext } from "../../../services/service";
import { NikkeiNewsRouter } from "./nikkei/router";
import { NipponNewsRouter } from "./nippon/router";
import { KBSNewsRouter } from "./kbs/router";
import { AljazeeraNewsRouter } from "./aljazeera/router";
import { SBSNewsRouter } from "./sbs/router";

export class AsiaPacificNewsRouter {
    public static router(services: ServiceContext) {
        // 半島電視台
        AljazeeraNewsRouter.router(services);

        // KBS World
        KBSNewsRouter.router(services);

        // 日本經濟新聞
        NikkeiNewsRouter.router(services);

        // Nippon 日本網
        NipponNewsRouter.router(services);

        // 澳洲特別廣播服務公司 SBS
        SBSNewsRouter.router(services);
    }
}
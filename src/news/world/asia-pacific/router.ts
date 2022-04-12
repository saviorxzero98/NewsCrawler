import { ServiceContext } from "../../../services/service";
import { NikkeiNewsRouter } from "./nikkei/router";
import { NipponNewsRouter } from "./nippon/router";

export class AsiaPacificNewsRouter {
    public static router(services: ServiceContext) {
        // 日本經濟新聞
        NikkeiNewsRouter.router(services);

        // 日本網
        NipponNewsRouter.router(services);
    }
}
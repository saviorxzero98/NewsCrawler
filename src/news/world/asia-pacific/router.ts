import { ServiceContext } from "../../../services/service";
import { NikkeiNewsRouter } from "./nikkei/router";

export class AsiaPacificNewsRouter {
    public static router(services: ServiceContext) {
        // 日本經濟新聞
        NikkeiNewsRouter.router(services);
    }
}
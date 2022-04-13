import { ServiceContext } from "../../../services/service";
import { NowNewsRouter } from "./now/router";

export class HongKongNewsRouter {
    public static router(services: ServiceContext) {
        // NOW新聞
        NowNewsRouter.router(services);
    }
}
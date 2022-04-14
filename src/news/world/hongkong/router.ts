import { ServiceContext } from "../../../services/service";
import { NowNewsRouter } from "./now/router";
import { RTHKNewsRouter } from "./rthk/router";
import { InitiumNewsRouter } from "./initium/router";

export class HongKongNewsRouter {
    public static router(services: ServiceContext) {
        // 端傳媒
        InitiumNewsRouter.router(services);

        // NOW新聞
        NowNewsRouter.router(services);

        // 香港電台
        RTHKNewsRouter.router(services);
    }
}
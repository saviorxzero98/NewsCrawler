import { ServiceContext } from "../../services/service";

import { MeritTimesNewsRouter } from "./merittimes/router";

export class OthersNewsRouter {
    public static router(services: ServiceContext) {
        // 人間福報
        MeritTimesNewsRouter.router(services);
    }
}
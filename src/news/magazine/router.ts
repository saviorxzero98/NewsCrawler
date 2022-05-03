import { ServiceContext } from "../../services/service";

import { GVMNewsRouter } from "./gvm/router";

export class MagazineNewsRouter {
    public static router(services: ServiceContext) {
        // 遠見雜誌
        GVMNewsRouter.router(services);
    }
}
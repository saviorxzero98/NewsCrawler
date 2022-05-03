import { ServiceContext } from "../../services/service";
import { CWNewsRouter } from "./cw/router";
import { GVMNewsRouter } from "./gvm/router";

export class MagazineNewsRouter {
    public static router(services: ServiceContext) {
        // 天下雜誌
        CWNewsRouter.router(services);
        
        // 遠見雜誌
        GVMNewsRouter.router(services);
    }
}
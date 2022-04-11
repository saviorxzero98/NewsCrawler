import { ServiceContext } from "../../services/service";

import { GVMNewsRouter } from "./gvm/router";
import { MirrorMediaNewsNewsRouter } from "./mirrormedia/router";
import { CWNewsRouter } from "./cw/router";


export class MagazineNewsRouter {
    public static router(services: ServiceContext) {
        // 天下雜誌
        CWNewsRouter.router(services);

        // 遠見雜誌
        GVMNewsRouter.router(services);
        
        // 鏡周刊
        MirrorMediaNewsNewsRouter.router(services);
    }
}
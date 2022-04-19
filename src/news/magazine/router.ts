import { ServiceContext } from "../../services/service";

import { GVMNewsRouter } from "./gvm/router";
import { MirrorMediaNewsNewsRouter } from "./mirrormedia/router";


export class MagazineNewsRouter {
    public static router(services: ServiceContext) {
        // 遠見雜誌
        GVMNewsRouter.router(services);
        
        // 鏡周刊
        MirrorMediaNewsNewsRouter.router(services);
    }
}
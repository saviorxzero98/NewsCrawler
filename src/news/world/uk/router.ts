import { ServiceContext } from "../../../services/service";
import { FTsNewsRouter } from "./ft/router";



export class UKNewsRouter {
    public static router(services: ServiceContext) {
        // 英國金融時報
        FTsNewsRouter.router(services);
    }
}
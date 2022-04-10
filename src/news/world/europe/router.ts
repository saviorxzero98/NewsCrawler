import { ServiceContext } from "../../../services/service";
import { FTsNewsRouter } from "./ft/router";
import { BBCNewsRouter } from "./bbc/router";
import { ReutersNewsRouter } from "./reuters/router";



export class EuropeNewsRouter {
    public static router(services: ServiceContext) {
        // BBC
        BBCNewsRouter.router(services);

        // 英國金融時報
        FTsNewsRouter.router(services);

        ReutersNewsRouter.router(services);
    }
}
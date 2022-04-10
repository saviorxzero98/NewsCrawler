import { ServiceContext } from "../../../services/service";
import { FTsNewsRouter } from "./ft/router";
import { BBCNewsRouter } from "./bbc/router";
import { ReutersNewsRouter } from "./reuters/router";
import { RfiNewsRouter } from "./rfi/router";



export class EuropeNewsRouter {
    public static router(services: ServiceContext) {
        // BBC
        BBCNewsRouter.router(services);

        // 英國金融時報
        FTsNewsRouter.router(services);

        // 路透社
        ReutersNewsRouter.router(services);

        // 法國廣播公司 RFI
        RfiNewsRouter.router(services);
    }
}
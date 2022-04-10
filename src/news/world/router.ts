import { ServiceContext } from "../../services/service";
import { ChinaNewsRouter } from "./china/router";
import { EuropeNewsRouter } from "./europe/router";
import { HongKongNewsRouter } from "./hongkong/router";
import { JapanNewsRouter } from "./japan/router";
import { KoreaNewsRouter } from "./korea/router";
import { UKNewsRouter } from "./uk/router";
import { USANewsRouter } from "./usa/router";



export class WorldNewsRouter {
    public static router(services: ServiceContext) {
        
        ChinaNewsRouter.router(services);

        EuropeNewsRouter.router(services);

        HongKongNewsRouter.router(services);

        JapanNewsRouter.router(services);

        KoreaNewsRouter.router(services);

        UKNewsRouter.router(services);

        USANewsRouter.router(services);
    }
}
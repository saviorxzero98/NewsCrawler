import { ServiceContext } from "../../services/service";
import { ChinaNewsRouter } from "./china/router";
import { EuropeNewsRouter } from "./europe/router";
import { HongKongNewsRouter } from "./hongkong/router";
import { JapanNewsRouter } from "./japan/router";
import { USANewsRouter } from "./usa/router";
import { AsiaPacificNewsRouter } from "./asia-pacific/router";



export class WorldNewsRouter {
    public static router(services: ServiceContext) {
        
        AsiaPacificNewsRouter.router(services);

        ChinaNewsRouter.router(services);

        EuropeNewsRouter.router(services);

        HongKongNewsRouter.router(services);

        JapanNewsRouter.router(services);

        USANewsRouter.router(services);
    }
}
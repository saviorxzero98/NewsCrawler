import { ServiceContext } from "../../services/service";
import { EuropeNewsRouter } from "./europe/router";
import { HongKongNewsRouter } from "./hongkong/router";
import { USANewsRouter } from "./usa/router";
import { AsiaPacificNewsRouter } from "./asia-pacific/router";


export class WorldNewsRouter {
    public static router(services: ServiceContext) {
        
        AsiaPacificNewsRouter.router(services);

        EuropeNewsRouter.router(services);

        HongKongNewsRouter.router(services);

        USANewsRouter.router(services);
    }
}
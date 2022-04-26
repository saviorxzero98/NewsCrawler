import { ServiceContext } from "../../services/service";
import { TechNewsNewsRouter } from "./technews/router";
import { IThomeNewsRouter } from "./ithome/router";
import { TomorrowSciNewsRouter } from "./tomorrowsci/router";
import { PansciNewsRouter } from "./pansci/router";
import { NatgeoMediaNewsRouter } from "./natgeomedia/router";
import { TAMNewsRouter } from "./tam/router";

export class TechAndScienceNewsRouter {
    public static router(services: ServiceContext) {
        // iThome
        IThomeNewsRouter.router(services);

        // 國家地理頻道
        NatgeoMediaNewsRouter.router(services);

        // 泛科學
        PansciNewsRouter.router(services);

        // 臺北市天文科學教育館
        TAMNewsRouter.router(services);

        // 科技新報
        TechNewsNewsRouter.router(services);

        // 明日科學
        TomorrowSciNewsRouter.router(services);
    }
}
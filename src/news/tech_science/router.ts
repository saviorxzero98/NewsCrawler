import { ServiceContext } from "../../services/service";
import { TechNewsNewsRouter } from "./technews/router";
import { IThomeNewsRouter } from "./ithome/router";
import { TomorrowSciNewsRouter } from "./tomorrowsci/router";



export class TechAndScienceNewsRouter {
    public static router(services: ServiceContext) {
        // iThome
        IThomeNewsRouter.router(services);

        // 科技新報
        TechNewsNewsRouter.router(services);

        // 明日科學
        TomorrowSciNewsRouter.router(services);
    }
}
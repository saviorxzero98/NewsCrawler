import { ServiceContext } from "../../services/service";
import { TechNewsNewsRouter } from "./technews/router";



export class TechNewsRouter {
    public static router(services: ServiceContext) {
        // 科技新報
        TechNewsNewsRouter.router(services);
    }
}
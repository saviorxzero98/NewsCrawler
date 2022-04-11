import { ServiceContext } from "../../services/service";
import { YahooTwNewsRouter } from "./yahoo/router";
import { YamNewsRouter } from "./yam/router";

export class CollectionNewsRouter {
    public static router(services: ServiceContext) {
        // Yahoo奇摩新聞
        YahooTwNewsRouter.router(services);

        // 蕃薯藤新聞
        YamNewsRouter.router(services);
    }
}
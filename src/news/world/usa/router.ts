import { ServiceContext } from "../../../services/service";
import { NTDTVNewsRouter } from "./ntdtv/router";
import { VOANewsRouter } from "./voa/router";
import { NYTimesNewsRouter } from "./nytimes/router";
import { WSJNewsRouter } from "./wsj/router";
import { EpochTimesNewsRouter } from "./epochtimes/router";

export class USANewsRouter {
    public static router(services: ServiceContext) {
        // 大紀元
        EpochTimesNewsRouter.router(services);

        // 新唐人電視台
        NTDTVNewsRouter.router(services);

        // 紐約時報
        NYTimesNewsRouter.router(services);

        // 美國之音
        VOANewsRouter.router(services);

        // 華爾街日報
        WSJNewsRouter.router(services);
    }
}
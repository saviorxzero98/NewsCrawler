import { ServiceContext } from '../../services/service';

import { FourGamersNewsRouter } from './4gamers/router';
import { GamerGNNNewsRouter } from './gamer/router';
import { QooAppNewsRouter } from './qooapp/router';
import { GamebaseNewsRouter } from './gamebase/router';
import { KenshinNewsRouter } from './kenshin/router';
import { GammeNewsRouter } from './gamme/router';


export class ACGNewsRouter {
    public static router(services: ServiceContext) {
        // 遊戲基地
        GamebaseNewsRouter.router(services);

        // 巴哈姆特 GNN
        GamerGNNNewsRouter.router(services);

        // 卡卡洛普 (宅宅新聞)
        GammeNewsRouter.router(services);

        // 4Gamers
        FourGamersNewsRouter.router(services);

        // 劍心．回憶
        KenshinNewsRouter.router(services);

        // QooApp
        QooAppNewsRouter.router(services);
    }
}
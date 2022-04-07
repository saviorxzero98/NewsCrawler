import { ServiceContext } from '../../services/service';

import { FourGamersNewsRouter } from './4gamers/router';
import { GamerGNNNewsRouter } from './gamer/router';
import { QooAppNewsRouter } from './qooapp/router';


export class ACGNewsRouter {
    public static router(services: ServiceContext) {
        // 巴哈姆特 GNN
        GamerGNNNewsRouter.router(services);

        // 4Gamers
        FourGamersNewsRouter.router(services);

        // QooApp
        QooAppNewsRouter.router(services);
    }
}
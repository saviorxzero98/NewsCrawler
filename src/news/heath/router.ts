import { ServiceContext } from '../../services/service';
import { HeathMediaNewsRouter } from './healthmedia/router';
import { HehoNewsRouter } from './heho/router';
import { HelloYishiNewsRouter } from './helloyishi/router';


export class HeathNewsRouter {
    public static router(services: ServiceContext) {
        // NOW健康
        HeathMediaNewsRouter.router(services);

        // Heho健康
        HehoNewsRouter.router(services);

        // Hello醫師
        HelloYishiNewsRouter.router(services);
    }
}
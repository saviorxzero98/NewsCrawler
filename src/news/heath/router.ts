import { ServiceContext } from '../../services/service';
import { HeathMediaNewsRouter } from './healthmedia/router';
import { HehoNewsRouter } from './heho/router';
import { HelloYishiNewsRouter } from './helloyishi/router';
import { Top1HealthNewsRouter } from './top1health/router';


export class HeathNewsRouter {
    public static router(services: ServiceContext) {
        // NOW健康
        HeathMediaNewsRouter.router(services);

        // Heho健康
        HehoNewsRouter.router(services);

        // Hello醫師
        HelloYishiNewsRouter.router(services);

        // 華人健康網
        Top1HealthNewsRouter.router(services);
    }
}
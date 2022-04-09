import { ServiceContext } from '../../services/service';
import { HeathMediaNewsRouter } from './healthmedia/router';


export class HeathNewsRouter {
    public static router(services: ServiceContext) {
        HeathMediaNewsRouter.router(services);
    }
}
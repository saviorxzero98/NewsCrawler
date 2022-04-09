import { FeedBuilder } from '../../feeds/feedBuilder';
import { ServiceContext } from '../../services/service';
import { SportSVNewsRouter } from './sportsv/router';

const path = {
}

export class SportNewsRouter {
    public static router(services: ServiceContext) {
        // 運動視界
        SportSVNewsRouter.router(services);
    }
}
import * as axios from 'axios';
import * as cheerio from 'cheerio';

import { ServiceContext } from "../service";
import { Item } from "feed";

const httpClient = axios.default;

export type NewsItem = {
    title: string,
    link: string,
    image?: string,
    description?: string,
    date ?: Date
}

export abstract class NewsCrawler {
    protected services: ServiceContext;
    constructor(services: ServiceContext) {
        this.services = services;
    }

    public async getDetials(list: NewsItem[], callback: (item: NewsItem, data: any) => any, options ?: any) {
        let items = await Promise.all(
            list.map(async (item) => 
                this.services
                    .cache
                    .tryGet<Item>(item.link, async () => {
                        let detailResponse = await httpClient.get(item.link, options);
                        return await callback(item, detailResponse.data);
                    })
            )
        );
        return items;
    }
}
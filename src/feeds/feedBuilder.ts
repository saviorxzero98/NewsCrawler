import { Feed, FeedOptions, Item } from "feed";

const copyright: string = '';

export enum FeedFormat {
    rss2,
    atom1,
    json
}

export class FeedBuilder {
    public options: FeedOptions;
    public items: Item[];

    public constructor(title: string, link: string) {
        this.options = {
            id: link,
            title,
            link,
            copyright,
            description: title,
            language: 'zh-tw',
            generator: 'MyRSS',
            updated: new Date()
        }
        this.items = [];
    }

    public addItem(item: Item): FeedBuilder {
        this.items.push(item);
        return this;
    }
    public addItems(items: Item[]): FeedBuilder {
        for (let item of items) {
            if (item.image) {
                item.description = `<p><img src="${item.image}"></p>${item.description}`;
            }
            this.items.push(item);
        }
        return this;
    }

    public create(format: FeedFormat = FeedFormat.rss2): string {
        let feed = new Feed(this.options);
        
        for (let item of this.items) {
            feed.addItem(item);
        }

        switch (format) {
            case FeedFormat.atom1:
                return feed.atom1();

            case FeedFormat.json:
                return feed.json1();

            case FeedFormat.rss2:
            default:
                return feed.rss2();
        }
    }
}


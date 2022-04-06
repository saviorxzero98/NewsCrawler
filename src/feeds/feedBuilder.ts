import { Feed, FeedOptions, Item } from "feed";
import { OpenCC } from 'opencc';

const copyright: string = '';

export enum FeedFormat {
    rss2,
    atom1,
    json
}

export enum OpenCCType {
    s2t = 's2t',
    t2s = 't2s',
    s2tw = 's2tw',
    tw2s = 'tw2s',
    s2hk = 's2hk',
    hk2s = 'hk2s',
    s2twp = 's2twp',
    tw2sp = 'tw2sp'
}

export class FeedBuilder {
    public options: FeedOptions;
    public items: Item[];
    public openccType: string = '';

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

    public setOpenCC(type: string): FeedBuilder {
        if (type) {
            if (OpenCCType[type]) {
                this.openccType = type;
            }
        }
        return this;
    }

    public addItem(item: Item): FeedBuilder {
        if (this.openccType && OpenCCType[this.openccType]) {
            item.title = this.convertCC(item.title, this.openccType);
            item.description = this.convertCC(item.description, this.openccType);
        }

        if (item.image) {
            item.description = `<p><img src="${item.image}"></p>${item.description}`;
            item.image = '';
        }
        
        this.items.push(item);
        return this;
    }
    public addItems(items: Item[]): FeedBuilder {
        for (let item of items) {
            if (this.openccType && OpenCCType[this.openccType]) {
                item.title = this.convertCC(item.title, this.openccType);
                item.description = this.convertCC(item.description, this.openccType);
            }

            if (item.image) {
                item.description = `<p><img src="${item.image}"></p>${item.description}`;
                item.image = '';
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

    private convertCC(text: string, type: string): string {
        let converter = new OpenCC(`${type}.json`);
        let outText = converter.convertSync(text);
        return outText;
    }
}
import { Feed, FeedOptions, Item } from "feed";
import { simplecc } from "simplecc-wasm";

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
    s2hk = 's2hk',
    s2twp = 's2twp',
    hk2s = 'hk2s',
}

export class FeedBuilder {
    public title: string;
    public link: string;
    public items: Item[];
    public openccType: string = '';

    public constructor(title: string, link: string) {
        this.title = title;
        this.link = link;
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
        let options = this.createFeedOptions();
        
        let feed = new Feed(options);
        
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

    public sendFeedResponse(res: any, format: FeedFormat = FeedFormat.rss2) {
        if (res) {
            let content = this.create(format);

            switch (format) {
                case FeedFormat.atom1:
                    res.set('Content-Type', 'application/atom+xml');
                    break;

                case FeedFormat.json:
                    res.set('Content-Type', 'application/json');
                    break;

                case FeedFormat.rss2:
                default:
                    res.set('Content-Type', 'application/rss+xml');
                    break;
            }
            
            res.send(content);
        }
    }


    private createFeedOptions(): FeedOptions {
        this.title = this.convertCC(this.title, this.openccType);
        let language = 'zh-tw';

        switch (this.openccType) {
            case OpenCCType.hk2s:
            case OpenCCType.t2s:
                language = 'zh-cn';
                break;

            case OpenCCType.s2hk:
                language = 'zh-hk';
                break;

            case OpenCCType.s2t:
            case OpenCCType.s2tw:
            case OpenCCType.s2twp:
                language = 'zh-tw';
                break;
        }


        let options = {
            id: this.link,
            title: this.title,
            link: this.link,
            copyright: '',
            description: this.title,
            language: language,
            generator: 'MyRSS',
            updated: new Date()
        }
        return options;
    }


    private convertCC(text: string, type: string): string {
        let outText = text;
        if (type) {
            outText = simplecc(text, type);
        }
        return outText;
    }
}
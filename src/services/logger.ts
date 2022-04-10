
export class Logger {
    public logGetUrl(url: string) {
        console.log(`GET ${url}`);
    }

    public logGetRssUrl(url: string) {
        console.log(`GET RSS ${url}`);
    }

    public logPostUrl(url: string) {
        console.log(`POST ${url}`);
    }

    public logError(e: any) {
        if (e) {
            console.error(e);
        }
    }
}
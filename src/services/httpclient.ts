import * as rax from 'retry-axios';
import axios from 'axios';

export const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'; 

export const crawlerHeaders = {
    'User-Agent': userAgent
}

export type HttpResponse = {
    data ?: any,
    status ?: any
}


export class HttpClient {
    public retry: number = 2;
    public retryDelay: number = 5000;
    public timeout: number = 30000;


    public async get(url: string, headers ?: any) {
        let response = await axios({
            url,
            method: 'get',
            headers: headers,
            raxConfig: {
                retry: this.retry,
                retryDelay: this.retryDelay
            },
            timeout: this.timeout
        });
        return response;
    }

    public async post(url: string, data: any, headers ?: any) {
        let response = await axios({
            url,
            method: 'post',
            headers: headers,
            data: data,
            raxConfig: {
                retry: this.retry,
                retryDelay: this.retryDelay
            },
            timeout: this.timeout
        });
        return response;
    }
}

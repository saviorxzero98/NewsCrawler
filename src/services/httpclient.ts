import * as rax from 'retry-axios';
import axios from 'axios';

export const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.149 Safari/537.36'; 

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

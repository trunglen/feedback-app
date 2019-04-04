import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { HttpClient, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { HttpInterceptor } from '@angular/common/http/src/interceptor';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { HostConfig } from '../runtime/project.config';
import { ToastNotificationService } from './toast-notification.service';
@Injectable()
export class HttpApi<T> {
    // private host: string = environment.baseURL;
    constructor(
        private http: Http,
        private hostConfig: HostConfig
    ) {
    }

    public Get(endPoint: string, query?: any) {
        const apiURL = `${this.hostConfig.Http + endPoint}`;
        const param = new URLSearchParams();
        if (query) {
            Object.keys(query).forEach((k) => {
                param.set(k, query[k]);
            });
        }
        return this.http.get(apiURL, { params: param }).map((res: Response) => this.transformResponse(res)).catch((error: any) => {
            return Observable.throw(error);
        });
    }

    public Post(endPoint: string, body?: any) {
        const apiURL = `${this.hostConfig.Http + endPoint}`;
        return this.http.post(apiURL, body).map((res: Response) => this.transformResponse(res)).catch((error: any) => {
            this.handleError(error);
            return Observable.throw(error);
        });
    }

    public transformResponse(result: Response) {
        return <T>result.json().data || <T>{};
    }
    public handleError(err) {

    }
}


@Injectable()
export class HttpService {
    constructor(
        private http: HttpClient,
        private hostConfig: HostConfig
    ) { }

    Get<T>(url: string, params?: any) {
        url = `${this.hostConfig.Http + url}`;
        return this.http.get<T>(url, { params: params }).map(res => {
            return res['data'] ? res['data'] : []
        })
    }

    Post<T>(url: string, body: any) {
        url = `${this.hostConfig.Http + url}`;
        return this.http.post(url, body).map(res => {
            return res['data'] ? res['data'] : []
        }).catch(err => {
            return Observable.throw(err)
        })
    }

    Delete<T>(url: string, params?: any) {
        url = `${this.hostConfig.Http + url}`;
        return this.http.delete(url, { params: params }).catch(err => {
            return Observable.throw(err)
        })
    }
}


@Injectable()
export class HttpErrorService implements HttpInterceptor {

    constructor(
        private toastService: ToastNotificationService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).do((event: HttpEvent<any>) => { }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                console.log(err)
                // do error handling here
                if (err.status == 0) {
                    console.log('Không kết nối được đến server')
                    this.toastService.error('Không kết nối được đến server');
                } else {
                    console.log(err)
                    this.toastService.error(err.error['error']);
                }
            }
        });
    }
}

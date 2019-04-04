import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HostConfig } from '../runtime/project.config';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket'
import { Subject } from 'rxjs';
import "rxjs/add/operator/retryWhen";
import "rxjs/add/operator/delay";
import "rxjs/add/operator/take";

@Injectable()
export class SocketService {
    private ws: WebSocket;
    message$: Subject<any> = new Subject();
    constructor(
        private hostConfig: HostConfig
    ) {
    }
    connect(param: any) {
        const uri = ObjectToString(param);
        this.ws = new WebSocket(`${this.hostConfig.CetmWebSocket}${uri}`);
        this.ws.onmessage = (message) => {
            const response = <string>message.data;
            const temp = response.split(' ');
            const data = JSON.parse(response.substr(response.indexOf(' ') + 1));
            if (temp[0] === '/error') {
                this.message$.error(data);
            } else {
                this.message$.next(data);
            }
        };
    }
}

export function ObjectToString(params: Object) {
    let result = '';
    let i = 0;
    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            const element = params[key];
            if (i === 0) {
                result += ('?' + key + '=' + element);
            } else {
                result += ('&' + key + '=' + element);
            }
            i++;
        }
    }
    return result;
}


@Injectable()
export class WebSocketService {

    subject: WebSocketSubject<Payload>
    constructor(
        private hostConfig: HostConfig
    ) {

    }
    connect(uri: string) {
        this.subject = webSocket({
            url: uri,
            deserializer: (msgEvent) => {
                const msg = msgEvent.data
                let splitIndex = msg.indexOf(' ')
                let pattern = msg.slice(0, splitIndex)
                if (pattern == 'reload') {
                    window.location.reload()
                }
                let data = msg.slice(splitIndex, msg.length)
                return <Payload>{ pattern: pattern, data: JSON.parse(data) }
            },
            serializer: (payload: Payload) => {
                return payload.pattern + ' ' + JSON.stringify(payload.data)
            },
            openObserver: {
                next: value => {
                },
                error: err => {
                    console.log(err)
                }
            }
        });
        // subject.subscribe(
        //     (msg) => console.log('message received: ' + msg.data.counter.id),
        //     (err) => console.log(err),
        //     () => console.log('complete')
        // );
        return this.subject.retryWhen(errors => {
            return errors.delay(3000).take(100)
        })
    }

    sendMessage(payload: Payload) {
        this.subject.next(payload)
    }
}

export class Payload {
    pattern: string
    data: any
}
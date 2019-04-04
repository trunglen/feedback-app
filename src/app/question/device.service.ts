import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Question, Campaign } from '../shared/models/campaign.model';
import { HttpApi, HttpService } from '../shared/http';
import { Result } from '../shared/models/result.model';

// @Injectable()
// export class DeviceService {
//     public answerSubject = new Subject<Question>();
//     public previewAnswerSubject = new Subject<Question>();
//     constructor(
//         private http: HttpApi<Campaign>
//     ) { }

//     answer(q: Question) {
//         this.answerSubject.next(q);
//     }

//     answerPreview(q: Question) {
//         this.previewAnswerSubject.next(q);
//     }

//     getPreviewSurvey(surveyID: string) {
//         return this.http.Get('/api/survey/get', { id: surveyID });
//     }

//     addResult(r: Result) {
//         return this.http.Post('/api/survey/result/create ', r);
//     }

//     addUnfinishResult(r: Result) {
//         return this.http.Post('/api/survey/unfinish_result/create ', r);
//     }

//     getCampaigns(device, channel: string) {
//         if (channel != '') {
//             return this.http.Get('/api/campaign/device/get', { device_id: device, channel: channel, at: new Date().getTime() })
//         }
//         // return this.http.Get('/api/campaign/device/get', { device_id: device, channel: channel, at: new Date().getTime() })
//         return this.http.Get('/api/device/campaign/get', { device_code: device })
//     }
// }

@Injectable()
export class DeviceService {
    public answerSubject = new Subject<Question>();
    public previewAnswerSubject = new Subject<Question>();
    constructor(
        private http: HttpService
    ) { }

    answer(q: Question) {
        this.answerSubject.next(q);
    }

    answerPreview(q: Question) {
        this.previewAnswerSubject.next(q);
    }

    getPreviewSurvey(surveyID: string) {
        return this.http.Get('/api/survey/get', { id: surveyID });
    }

    addResult(r: Result) {
        return this.http.Post('/api/survey/result/create ', r);
    }

    addUnfinishResult(r: Result) {
        return this.http.Post('/api/survey/unfinish_result/create ', r);
    }

    getCampaigns(device, channel: string) {
        var endpoint = '/api/public/website/campaign/get'
        if (device) {
            endpoint = '/api/public/device/campaign/get'
        }
        return this.http.Get(endpoint, { device_code: device });
    }
}
import { Component, OnInit, HostBinding } from '@angular/core';
import { SocketService, WebSocketService } from '../shared/socket.service';
import { Campaign, Question } from '../shared/models/campaign.model';
import { Result } from '../shared/models/result.model';
import { Storage } from '../shared/storage';
import { checkEmptyObject } from '../shared/utils';
import { FeedbackSocketService, ObjectToString } from '../shared/feedback-socket.service';
import { ActivatedRoute } from '@angular/router';
import { DeviceService } from './device.service';
import { TranslateService } from '../core/translate.service';
import { HostConfig } from '../runtime/project.config';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
  providers: [
    WebSocketService
  ]
})
export class QuestionComponent implements OnInit {
  campaign: Campaign = <Campaign>{};
  showingQuestion: Question = <Question>{};
  result: Result = new Result();
  currentLanguage: string
  channel: string = ''
  showAlertNoCampaign = false
  isFinish = false
  @HostBinding('style.background') background;
  constructor(
    private deviceService: DeviceService,
    private webSocketService: WebSocketService,
    private activedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private hostConfig: HostConfig
  ) { }

  ngOnInit() {
    this.translateService.selectedLanguage.subscribe(res => this.currentLanguage = res)
    var queryParam = this.activedRoute.snapshot.queryParams
    if (queryParam.channel) {
      console.log('cxzcx')
      this.webSocketService.connect(`${this.hostConfig.WebSocket}/socket/join?actor_name=website`).subscribe()
      this.channel = queryParam.channel
      this.result.initResult(null, null, null, null, queryParam.channel)
      this.getCampaign(null, queryParam.channel);
      this.handleAnser();
    } else {
      console.log('321321')
      this.handleAnser();
      this.handleSocket();
    }
    // .subscribe(res => {
    //   console.log(res)
    //   if (checkEmptyObject(res)) {
    //     this.handleAnser();
    //     this.handleSocket();
    //   } else {
    //     if (res.channel) {
    //       this.webSocketService.connect(`${this.hostConfig.WebSocket}/socket/join?actor_name=website`).subscribe()
    //       this.channel = res.channel
    //       this.result.initResult(null, null, null, null, res.channel)
    //       this.getCampaign(null, res.channel);
    //       this.handleAnser();
    //     }
    //   }
    // });
  }

  handleSocket() {
    const setting = Storage.getLocal('device');
    this.webSocketService.connect(`${this.hostConfig.WebSocket}/socket/join?actor_name=${this.channel == '' ? 'device' : 'website'}&device_id=${setting.feedback_code}`).subscribe(res => {
      console.log(res)
    })
    this.webSocketService.connect(`${this.hostConfig.CetmWebSocket}${ObjectToString(setting)}`).subscribe(res => {
      const data = res.data
      switch (res.pattern) {
        case '/initial':
          this.result.initResult(data.counter_activities);
          break;
        case '/assets':
          this.result.store = data[0].branch.name;
          break;
        case '/ticket_action':
          if (data.action === 'call') {
            this.getCampaign(setting.feedback_code)
            this.translateService.changeLanguage('primary')
          } else if (data.action === 'finish' || data.action === 'cancel' || data.action === 'move') {
            this.showingQuestion = <Question>{ type: '' }
          }
          break;
      }

    }, err => console.log(err));
  }

  getCampaign(device: string, channel?: string) {
    this.deviceService.getCampaigns(device, channel).subscribe(res => {
      if (!checkEmptyObject(res)) {
        this.showAlertNoCampaign = false
        this.campaign = <Campaign>res;
        console.log(this.campaign)

        const surveys = this.campaign.survey;
        if (surveys) {
          this.showingQuestion = surveys[0].questions[0];
        }
      } else {
        this.showAlertNoCampaign = true
      }
    }, err => {
      console.log(err)
      this.showAlertNoCampaign = true
    });
  }

  handleAnser() {
    this.deviceService.answerSubject.subscribe(res => {
      const q = <Question>res;
      this.result.initResult(null, this.campaign, this.campaign.survey[flag], q);
      const question = getNextQuestion(this.campaign, q);
      if (question) {
        this.showingQuestion = question;
      } else {
        this.deviceService.addResult(this.result).subscribe(resp => {
          // this.feedbackSocketService.message$.next(this.result);
          this.result.refresh();
        }, err => console.log(err));
        const temp = <Question>{ type: 'tks', content: '' };
        this.isFinish = true
        this.showingQuestion = temp;
        setTimeout(() => {
          this.result.refresh();
          if (this.channel === 'website') {
            this.getCampaign(null, 'website')
          } else {
            this.showingQuestion = <Question>{};
          }
        }, 3000);
      }
    });
  }
  // showAlert() {
  //   const setting = Storage.getLocal('device');
  //   this.deviceService.getCampaigns(setting.feedback_code, '').subscribe(res => {
  //     if (checkEmptyObject(res)) {
  //       this.showAlertNoCampaign = true
  //     }
  //   })
  // }
}

let flag = 0;
function getNextQuestion(campaign: Campaign, current: Question) {
  let link: number;
  // cau single neu khong chon dap an nao se link luon cau
  if (current.type === 'single' && current.result) {
    link = current.result[0].link;
  } else {
    link = current.link || current.result[0].link;
  }
  if (link !== -1) {
    return campaign.survey[flag].questions[link];
  } else {
    if (flag < campaign.survey.length - 1) {
      flag++;
      return campaign.survey[flag].questions[0];
    } else {
      flag = 0;
      return null;
    }
  }
}

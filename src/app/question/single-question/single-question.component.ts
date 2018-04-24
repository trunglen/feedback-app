import { Component, OnInit, Input } from '@angular/core';
import { Question, Answer } from '../../shared/models/campaign.model';
import { DeviceService } from '../device.service';
import { BaseComponent } from '../../utils/base/base.component';

@Component({
  selector: 'app-single-question',
  templateUrl: './single-question.component.html',
  styles: [
    `.answer-item{
      width: 16%;
      padding: 4% 3% 4% 3%;
      background: url('assets/images/multiple-bg.png');      
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
      text-align: center;
  }
  .answer-item img {
      width: 72%;
      height: auto;
  }`
  ]
})
export class SingleQuestionComponent extends BaseComponent implements OnInit {

  @Input() question: Question;
  @Input() mode: string;
  selectAnswer = -1;
  currentPage = 1;
  constructor(
    private deviceService: DeviceService,
  ) { super() }

  ngOnInit() {
  }

  onSelect(a: Answer, i: number) {
    if (this.question.result && this.selectAnswer === i) {
      this.selectAnswer = -1;
      this.question.result = null;
    } else {
      this.selectAnswer = i;
      this.question.result = <Answer[]>[a];
    }
  }

  onAnswer() {
    if (this.mode) {
      this.deviceService.answerPreview(this.question);
    } else {
      this.deviceService.answer(this.question);
    }
    this.selectAnswer = -1;
  }

  disabled() {
    return !this.question.result && this.question.manded;
  }
}

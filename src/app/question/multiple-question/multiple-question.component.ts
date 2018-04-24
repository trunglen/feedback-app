import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Question, Answer } from '../../shared/models/campaign.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DeviceService } from '../device.service';
import { BaseComponent } from '../../utils/base/base.component';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-multiple-question',
  templateUrl: './multiple-question.component.html',
  styleUrls: ['./multiple-question.component.css']
})
export class MultipleQuestionComponent extends BaseComponent implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    console.log('changed', this.i18n)
  }

  @Input() question: Question;
  @Input() mode: string;
  multipleForm: FormGroup;
  style: any;
  currentPage = 1;
  constructor(
    private deviceService: DeviceService,
    private fb: FormBuilder
  ) { super() }

  ngOnInit() {
    const arr = this.question.answers.map((v, i, a) => {
      return this.fb.control({ i: null });
    });
    this.multipleForm = this.fb.group({
      'answers': this.fb.array(arr)
    });
  }

  onAnswer() {
    this.question.result = this.multipleForm.value.answers;
    if (this.mode) {
      this.deviceService.answerPreview(this.question);
    } else {
      this.deviceService.answer(this.question);
    }
  }

  disabled() {
    const answers = <Answer[]>this.multipleForm.value.answers;
    if (!answers.find(a => a !== null) && this.question.manded) {
      return true;
    }
    return false;
  }
}

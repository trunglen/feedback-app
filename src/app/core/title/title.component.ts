import { Component, OnInit, Input } from '@angular/core';
import { Question } from '../../shared/models/campaign.model';
import { TranslateService } from '../translate.service';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent implements OnInit {
  @Input() title: Question
  currentLanguage: string
  constructor(
    private translateService: TranslateService,
  ) { }

  ngOnInit() {
    this.translateService.selectedLanguage.subscribe(res => this.currentLanguage = res)
  }

}

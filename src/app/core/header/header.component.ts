import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../layout.service';
import { environment } from '../../../environments/environment';
import { HostConfig } from '../../runtime/project.config';
import { TranslateService } from '../translate.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [
  ]
})
export class HeaderComponent implements OnInit {
  logo: string = '';
  date = 1520501414000;
  constructor(
    private layoutService: LayoutService,
    private hostConfig: HostConfig,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.layoutService.settingSubject.subscribe(res => console.log(res));
    this.logo = `${this.hostConfig.Http}/static/setting/logo`;
  }

  changeLanguage(language: string) {
    this.translateService.changeLanguage(language)
  }
}

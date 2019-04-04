import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CommonModule } from '@angular/common';
import { TitleComponent } from './title/title.component';
import { ControlSlideComponent } from './control-slide/control-slide.component';
import { TranslateService } from './translate.service';
import { TranslatorDirective } from './translate.directive';
import { HttpService, HttpErrorService } from '../shared/http';
import { ToastNotificationService } from '../shared/toast-notification.service';
import { SnotifyService, ToastDefaults } from 'ng-snotify';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    TitleComponent,
    ControlSlideComponent,
    TranslatorDirective
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    TitleComponent,
    ControlSlideComponent,
    TranslatorDirective
  ],
  providers: [
    TranslateService,
    HttpService,
    ToastNotificationService,
    SnotifyService,
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorService,
      multi: true
    }
  ]
})
export class CoreModule { }

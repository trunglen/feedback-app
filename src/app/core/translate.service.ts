import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class TranslateService {
    selectedLanguage = new Subject<string>()
    currentLanguage
    constructor() { }

    changeLanguage(language: string) {
        this.selectedLanguage.next(language)
        this.currentLanguage = language
    }
}
import { Injectable } from '@angular/core';
import { SnotifyService } from 'ng-snotify';

@Injectable()
export class ToastNotificationService {

    constructor(
        private snotifyService: SnotifyService
    ) { }

    clear() {
        this.snotifyService.clear()
    }

    error(message: string) {
        this.snotifyService.error(message);
    }

    success(message: string) {
        this.snotifyService.success(message);
    }
}
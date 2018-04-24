import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}
// loadConfig().then(res => {
//   console.log(res);
// }).then(res2 => {
//   platformBrowserDynamic().bootstrapModule(AppModule)
//     .catch(err => console.log(err));
// })
// function loadConfig() {
//   return new Promise((resolve, reject) => {
//     resolve('hello');
//   });
// }
platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.log(err));


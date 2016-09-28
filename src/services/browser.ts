import { Injectable } from '@angular/core';

@Injectable()
export class BrowserService {
  open(url) {
    let cordova = window['cordova'];
    if (cordova && cordova.plugins && cordova.plugins.browsertab) {
      cordova.plugins.browsertab.isAvailable((result) => {
        if (!result) {
          window.open(url, '_system');
        } else {
          cordova.plugins.browsertab.openUrl(url, () => {}, () => {
            window.open(url, '_system');
          });
        }
      }, () => {
        window.open(url, '_system');
      });
    } else {
      window.open(url, '_system');
    }
  }
}

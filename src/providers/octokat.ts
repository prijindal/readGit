import {Injectable} from '@angular/core';

import {LocalService} from './local';

@Injectable()
export class OctokatService {
  public octo: any;
  private Octokat: any;
  public user: string;
  public userData: any;

  constructor(
    private local: LocalService
  ) {
    this.Octokat = window['Octokat'];
    this.checkLogin().catch(err => {
      this.logout();
    });
  }

  checkLogin() {
    return this.local.storage.get('TOKEN')
    .then(token => {
      if (token) {
        this.octo = new this.Octokat({
          token: token
        });
        return token;
      } else {
        this.octo = new this.Octokat({});
        throw new Error('Not Authenticated');
      }
    });
  }

  logout() {
    this.user = undefined;
    this.userData = undefined;
    return this.local.storage.clear()
    .then(res => {
      this.octo = new this.Octokat();
    });
  }
}

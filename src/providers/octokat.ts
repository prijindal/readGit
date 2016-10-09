import {Injectable} from '@angular/core';

import {LocalService} from './local';
import {ErrorService} from './error';

import Octokat from 'octokat';

@Injectable()
export class OctokatService {
  public octo: any;
  public user: string;
  public userData: any;

  constructor(
    private local: LocalService,
    private errorService: ErrorService
  ) {
    this.checkLogin().catch(err => {
      this.logout();
    });
  }

  checkLogin() {
    return this.local.storage.get('TOKEN')
    .then(token => {
      if (token) {
        this.octo = new Octokat({
          token: token
        });
        return token;
      } else {
        this.octo = new Octokat({});
        throw new Error('Not Authenticated');
      }
    });
  }

  logout() {
    this.user = undefined;
    this.userData = undefined;
    return this.local.storage.clear()
    .then(res => {
      this.octo = new Octokat();
    });
  }
}

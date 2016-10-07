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

  handleError(error: any) {
    let message: string;
    switch (error.status) {
      case 0:
        message = 'No Network Connection';
        break;
      case 404:
        message = 'Not Found';
        break;
      default:
        message = error.message || 'Unexpected Error';
    }
    return this.errorService.handleError(message);
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

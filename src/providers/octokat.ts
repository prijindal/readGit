import {Injectable} from '@angular/core';

import {LocalService} from './local';
import {ErrorService} from './error';

@Injectable()
export class OctokatService {
  public octo: any;
  private Octokat: any;
  public user: string;
  public userData: any;

  constructor(
    private local: LocalService,
    private errorService: ErrorService
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
    return this.errorService.handleError(message, error.title);
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

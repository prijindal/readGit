import {Injectable} from '@angular/core';

import LocalService from './local';

@Injectable()
export class OctokatService {
  public octo: any;
  private Octokat: any;
  public user: string; 

  constructor(
    private local: LocalService
  ) {
    this.Octokat = window['Octokat'];
    this.checkLogin();
  }

  checkLogin() {
    return this.local.storage.get('TOKEN')
    .then(token => {
      if (token) {
        this.octo = new this.Octokat({
          token: token,
          acceptHeader: 'application/vnd.github.cannonball-preview+json'
        });
        return token;
      } else {
        throw new Error('Not Authenticated');
      }
    });
  }

  logout() {
    return this.local.storage.clear()
    .then(res => {
      this.octo = new this.Octokat();
    });
  }
}

export default OctokatService;

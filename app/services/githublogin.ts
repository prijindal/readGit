import {Injectable} from '@angular/core';

import LocalService from './local';

@Injectable()
export class GithubLogin {
  constructor(
    private local: LocalService
  ) {}

  private OAuth_KEY = 'Leugpi8n-IkOgK47YTI8Y_uzUc4';
  private loggingIn: Boolean = false;

  login() {
    if (this.loggingIn) return ;
    this.loggingIn = true;
    return new Promise((resolve, reject) => {
      if (typeof window['cordova'] !== 'undefined') {
        if (window['OAuth']) {
          this.loginHelper(resolve, reject);
        } else {
          return this.loginWithOauth(resolve, reject);
        }
      } else {
        return this.loginWithOauth(resolve, reject);
      }
    });
  }

  loginWithOauth(resolve, reject) {
    var script = document.createElement( 'script' );
    script.type = 'text/javascript';
    script.onload = () => {
      this.loginHelper(resolve, reject);
    };
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/oauth-io/0.5.2/oauth.js';
    document.getElementsByTagName('html')[0]['append'](script);
  }

  loginHelper(resolve, reject) {
    console.log('Script Loaded');
    let OAuth = window['OAuth'];
    OAuth.initialize(this.OAuth_KEY);
    OAuth.popup('github', {cache: true})
    .done(result => {
      this.updateLocalStorage(result.access_token);
      resolve();
    })
    .fail(err => {
      console.error(err);
      reject('The sign in flow was canceled');
    });
  }

  updateLocalStorage(token) {
    this.local.storage.set('TOKEN', token);
  }

  logout() {
    this.loggingIn = false;
  }
}

export default GithubLogin;

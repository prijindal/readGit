import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs';


@Injectable()
export class GithubLogin {
  constructor(
    private http: Http
  ) {}

  token: string = localStorage['token'];
  private clientId = 'c6afa760610b0177b86b';
  private clientSecret = 'b40dc4d20753cb9ac2a9e8741ecf04574516f422';
  private OAuth_KEY = 'Leugpi8n-IkOgK47YTI8Y_uzUc4';
  private redirect_uri = 'http://localhost/callback';
  private requestToken: string;
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
      console.dir(result);
      this.token = result.access_token;
      this.updateLocalStorage();
      resolve();
    })
    .fail(err => {
      console.error(err);
      reject('The sign in flow was canceled');
    });
  }

  authenticate() {
    let headers = new Headers({'Accept': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let query  = 'client_id=' + this.clientId + '&client_secret=' + this.clientSecret + '&redirect_uri=' + this.redirect_uri + '&code=' + this.requestToken;
    return this.http.post('https://github.com/login/oauth/access_token?' + query, '', options)
    .catch((err) => {
      return Observable.throw(err);
    })
    .map((res) => {
      var data = res.json();
      this.token = data.access_token;
      this.updateLocalStorage();
      return data;
    });
  }

  updateLocalStorage() {
    localStorage['token'] = this.token;
  }
}

import {Injectable} from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import LocalService from './local';

const CLIENT_ID = 'c6afa760610b0177b86b';
const CLIENT_SECRET = 'b40dc4d20753cb9ac2a9e8741ecf04574516f422';

@Injectable()
export class GithubLogin {
  constructor(
    private local: LocalService,
    private http: Http
  ) {}

  login(username: string, password: string, twofactor?: string) {
    let headers = new Headers({
      'Accept': 'application/vnd.github.damage-preview',
      'Authorization': 'Basic ' + btoa(username + ':' + password),
      'Content-Type': 'application/json'
    });
    if (twofactor) {
      headers.append('X-GitHub-OTP', twofactor);
    }
    let body = {
      'scopes': [
        'public_repo'
      ],
      'note': 'Read Git APP',
      'client_id': CLIENT_ID,
      'client_secret': CLIENT_SECRET
    };
    let options = new RequestOptions({headers: headers});
    return this.http.post('https://api.github.com/authorizations', body, options)
    .map(res => res.json())
    .map(res => {
      this.updateLocalStorage(res.token);
      return res;
    });
  }

  updateLocalStorage(token) {
    this.local.storage.set('TOKEN', token);
  }
}

export default GithubLogin;

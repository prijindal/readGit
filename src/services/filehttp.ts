import {Injectable} from '@angular/core';
import { Http, Headers, RequestOptions, Response, RequestMethod } from '@angular/http';

import LocalService from './local';

@Injectable()
export class FileService {
  constructor(
    private local: LocalService,
    private http: Http
  ) {}

  getToken() {
    return new Promise((resolve: (res: string) => {}, reject) => {
      this.local.storage.get('TOKEN')
      .then(token => {
        resolve(token);
      })
      .catch(err => {
        resolve('');
      });
    });
  }

  getFileFromUrl(url, type: string = 'raw') {
    return new Promise((resolve: (res: Response) => {}, reject) => {
      this.getToken()
      .then(token => {
        this.sendRequest(url, type, token)
        .subscribe(resolve, reject);
      });
    });
  }

  getHtmlFromMarkdown(markdown: string) {
    return new Promise((resolve: (res: Response) => {}, reject) => {
      this.getToken()
      .then(token => {
        this.sendRequest('https://api.github.com/markdown', 'html', token, {text: markdown}, RequestMethod.Post)
        .subscribe(resolve, reject);
      });
    });
  }

  private sendRequest(url, type, token?, body?: Object, method: RequestMethod = RequestMethod.Get) {
    let headers = new Headers({
      'Accept': 'application/vnd.github.cannonball-preview.' + type + '+json',
      'Content-Type': 'application/json'
    });
    if (token) {
      headers.append('Authorization', 'token ' + token);
    }
    let options = new RequestOptions({
      method: method,
      body: body,
      headers: headers
    });

    return this.http.request(url, options);
  }
}

export default FileService;

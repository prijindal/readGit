import {Injectable} from '@angular/core';
import { Http, Headers, RequestOptions, Response, RequestMethod } from '@angular/http';

import {LocalService} from './local';

const HOST: string = 'https://api.github.com';

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

  getHeaders(url) {
    return new Promise((resolve: (res: Response) => {}, reject) => {
      this.getToken()
      .then(token => {
        this.sendRequest(url, 'raw', token, null, RequestMethod.Head)
        .subscribe(resolve, reject);
      });
    });
  }

  getLinkLength(res: Response): number {
    let linkHeader = res.headers.get('Link')
    if (linkHeader) {
      let linkArray = linkHeader.split('<https://api.github.com')
      let lastLink = linkArray[linkArray.length - 1];
      let lastPage = lastLink.substring(lastLink.search('page') + 'page'.length + 1, lastLink.search('per_page') - 1)
      return parseInt(lastPage);
    } else {
      return 0;
    }
  }

  private sendRequest(url, type, token?, body?: Object, method: RequestMethod = RequestMethod.Get) {
    let headers = new Headers({
      'Accept': 'application/vnd.github.cannonball-preview.' + type + '+json',
      'Content-Type': 'application/json'
    });
    if (token) {
      headers.append('Authorization', 'token ' + token);
    }
    if (url.indexOf(HOST) !== 0) {
      url = HOST + url
    }
    let options = new RequestOptions({
      method: method,
      body: body,
      headers: headers
    });

    return this.http.request(url, options);
  }
}

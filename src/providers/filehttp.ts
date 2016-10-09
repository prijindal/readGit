import {Injectable} from '@angular/core';
import { Http, Headers, RequestOptions, Response, RequestMethod } from '@angular/http';

import {LocalService} from './local';
import {ErrorService} from './error';

const HOST: string = 'https://api.github.com';

@Injectable()
export class FileService {
  public user: string;
  public userData: any;
  private token: string;

  constructor(
    private local: LocalService,
    private errorService: ErrorService,
    private http: Http
  ) {}

  checkLogin() {
    return this.local.storage.get('TOKEN')
    .then(token => {
      if (token) {
        this.token = token;
        return token;
      } else {
        throw new Error('Not Authenticated');
      }
    });
  }

  logout() {
    this.user = undefined;
    this.userData = undefined;
    return this.local.storage.clear()
    .then(res => {
      this.token = undefined;
    });
  }

  getFileFromUrl(url, type: string = 'raw') {
    return new Promise((resolve: (res: Response) => {}, reject) => {
      this.sendRequest(url, type)
      .subscribe(resolve, reject);
    });
  }

  getHtmlFromMarkdown(markdown: string) {
    return new Promise((resolve: (res: Response) => {}, reject) => {
      this.sendRequest('https://api.github.com/markdown', 'html', {text: markdown}, RequestMethod.Post)
      .subscribe(resolve, reject);
    });
  }

  getHeaders(url) {
    return new Promise((resolve: (res: Response) => {}, reject) => {
      this.sendRequest(url, 'raw', null, RequestMethod.Head)
      .subscribe(resolve, reject);
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

  postNewRequest(url, body, type: string = 'raw') {
    return new Promise((resolve: (res: Response) => {}, reject) => {
      this.sendRequest(url, type, body, RequestMethod.Post)
      .subscribe(resolve, reject);
    });
  }

  patchRequest(url, body, type: string = 'raw') {
    return new Promise((resolve: (res: Response) => {}, reject) => {
      this.sendRequest(url, type, body, RequestMethod.Patch)
      .subscribe(resolve, reject);
    });
  }

  putRequest(url, body, type: string = 'raw') {
    return new Promise((resolve: (res: Response) => {}, reject) => {
      this.sendRequest(url, type, body, RequestMethod.Put)
      .subscribe(resolve, reject);
    });
  }

  deleteRequest(url, type: string = 'raw') {
    return new Promise((resolve: (res: Response) => {}, reject) => {
      this.sendRequest(url, type, null, RequestMethod.Delete)
      .subscribe(resolve, reject);
    });
  }

  private sendRequest(url, type, body?: Object, method: RequestMethod = RequestMethod.Get) {
    let headers = new Headers({
      'Accept': 'application/vnd.github.cannonball-preview.' + type + '+json',
      'Content-Type': 'application/json'
    });
    if (this.token) {
      headers.append('Authorization', 'token ' + this.token);
    }
    if (url.indexOf(HOST) !== 0) {
      url = HOST + url
    }
    let options = new RequestOptions({
      method: method,
      headers: headers
    });
    if (body) {
      options.body = body;
    }
    return this.http.request(url, options);
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
}

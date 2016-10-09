import {Injectable} from '@angular/core';
import { Http, Headers, RequestOptions, Response, RequestMethod } from '@angular/http';

import {LocalService} from './local';
import {ErrorService} from './error';

const HOST: string = 'https://api.github.com';

@Injectable()
export class FileService {
  constructor(
    private local: LocalService,
    private errorService: ErrorService,
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

  postNewRequest(url, body, type: string = 'raw') {
    return new Promise((resolve: (res: Response) => {}, reject) => {
      this.getToken()
      .then(token => {
        this.sendRequest(url, type, token, body, RequestMethod.Post)
        .subscribe(resolve, reject);
      });
    });
  }

  patchRequest(url, body, type: string = 'raw') {
    return new Promise((resolve: (res: Response) => {}, reject) => {
      this.getToken()
      .then(token => {
        this.sendRequest(url, type, token, body, RequestMethod.Patch)
        .subscribe(resolve, reject);
      });
    });
  }

  putRequest(url, body, type: string = 'raw') {
    return new Promise((resolve: (res: Response) => {}, reject) => {
      this.getToken()
      .then(token => {
        this.sendRequest(url, type, token, body, RequestMethod.Put)
        .subscribe(resolve, reject);
      });
    });
  }

  deleteRequest(url, type: string = 'raw') {
    return new Promise((resolve: (res: Response) => {}, reject) => {
      this.getToken()
      .then(token => {
        this.sendRequest(url, type, token, null, RequestMethod.Delete)
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

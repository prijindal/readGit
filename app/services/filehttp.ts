import {Injectable} from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import LocalService from './local';

@Injectable()
export class FileService {
  constructor(
    private local: LocalService,
    private http: Http
  ) {}

  getFileFromUrl(url, type: string = 'raw') {
    return new Promise((resolve: (res: Response) => {}, reject) => {
      this.local.storage.get('TOKEN')
      .then(token => {
        this.sendRequest(url, type, token)
        .subscribe(resolve);
      })
      .catch(err => {
        this.sendRequest(url, type)
        .subscribe(resolve);
      });
    });
  }

  private sendRequest(url, type, token?) {
    let headers = new Headers({
      'Accept': 'application/vnd.github.damage-preview.' + type,
      'Content-Type': 'application/json'
    });
    if (token) {
      headers.append('Authorization', 'token ' + token);
    }
    let options = new RequestOptions({
      headers: headers
    });

    return this.http.get(url, options);
  }
}

export default FileService;
import { Injectable } from '@angular/core';
import { Http, RequestMethod, RequestOptions, Headers, Response } from '@angular/http';
import {Events} from 'ionic-angular';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';

import {FileService} from './filehttp';

const HOST: string = 'https://api.github.com/graphql';

const VIEWER_QUERY = `
{
	viewer {
    id
    login
    name
    email
    avatarURL(size: 50)
  }
}
`

@Injectable()
export class GraphApiService {
  constructor(
    public http: Http,
    private events: Events,
    private filehttp: FileService
  ) {}

  request(query: String, variables: Object = {}): Observable<any> {
    return Observable.create((observer) => {
      if (!this.filehttp.token) {
        this.filehttp.checkLogin()
        .then(() => {
          this.internalRequest(query, variables)
          .subscribe((res) => {observer.next(res)}, (err) => {observer.error(err)}, () => {observer.complete()})
        })
      } else {
        this.internalRequest(query, variables)
          .subscribe((res) => {observer.next(res)}, (err) => {observer.error(err)}, () => {observer.complete()})
      }
    })
  }

  verifyLogin() {
    this.filehttp.checkLogin()
    .then(res => {
      this.request(VIEWER_QUERY)
      .map(res => res.viewer)
      .subscribe(res => {
        this.filehttp.userData = res;
        this.filehttp.user = res.login;
        this.events.publish('login', true);
      })
    })
    .catch(err => {
      this.events.publish('login', false);
    })
  }

  private internalRequest(query: String, variables: Object = {}): Observable<any> {
    let headers = new Headers({
      Authorization: 'Bearer ' + this.filehttp.token
    })
    let options = new RequestOptions({
      method: RequestMethod.Post,
      headers: headers
    });
    let body = {
      query: query,
      variables: variables
    }
    return this.http.post(HOST, body, options)
      .map((res: Response) => res.json())
      .map(res => res.data)
  }
}

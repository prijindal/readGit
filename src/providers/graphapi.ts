import { Injectable } from '@angular/core';
import { Http, RequestMethod, RequestOptions, Headers, Response } from '@angular/http';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';

import {FileService} from './filehttp';

const HOST: string = 'https://api.github.com/graphql';

@Injectable()
export class GraphApiService {
  constructor(
    public http: Http,
    private filehttp: FileService
  ) {}

  request(query: String): Observable<any> {
    let headers = new Headers({
      Authorization: 'Bearer ' + this.filehttp.token
    })
    let options = new RequestOptions({
      method: RequestMethod.Post,
      headers: headers
    });
    let body = {
      query: query
    }
    return this.http.post(HOST, body, options)
      .map((res: Response) => res.json())
      .map(res => res.data)
  }
}
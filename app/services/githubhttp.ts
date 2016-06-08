import {Injectable, EventEmitter} from '@angular/core'
import {Http, Headers, RequestOptions} from '@angular/http'
import {Observable} from 'rxjs'

import {GithubLogin} from './githublogin'

@Injectable()
export class GithubHttp {
  constructor(
    private http:Http,
    private githubLogin:GithubLogin
  ) {}

  token:string = 'token ' + localStorage['token'];
  private headers:Headers = new Headers({'Authorization':this.token})

  started = new EventEmitter<void>()
  ended = new EventEmitter<void>()
  errored = new EventEmitter<Error>()

  private errorHandler(err:Error) {
    this.errored.emit(err)
    return Observable.throw(err)
  }

  public get(url:string, options:RequestOptions = new RequestOptions({headers:this.headers})) {
    options.merge({headers:this.headers})
    this.started.emit(null)

    return this.http.get(url, options)
            .map(res => {
              this.ended.emit(null)
              return res.json()
            })
            .catch(err => {return this.errorHandler(err)})
  }

  private request(method:string) {
    return function(url:string, jsonData:Object , options:RequestOptions = new RequestOptions({headers:this.headers})) {
      options.merge({headers:this.headers})
      this.started.emit(null)

      return this.http[method](url, JSON.stringify(jsonData), options)
              .map(res => {
                this.ended.emit(null)
                return res.json()
              })
              .catch(err => {return this.errorHandler(err)})
    }
  }

  public post = this.request('post');
  public patch = this.request('patch');
  public delete = this.request('delete');
}

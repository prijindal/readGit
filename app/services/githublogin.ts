import {Injectable} from '@angular/core'
import {Http, Headers, RequestOptions} from '@angular/http'
import {Observable} from 'rxjs'

declare var cordova:any;

@Injectable()
export class GithubLogin {
  constructor(
    private http:Http
  ) {}

  token:string = localStorage['token'];
  private clientId = 'c6afa760610b0177b86b';
  private clientSecret = 'b40dc4d20753cb9ac2a9e8741ecf04574516f422';
  private redirect_uri = "http://localhost/callback";
  private requestToken:string;

  login() {
    return new Promise((resolve, reject) => {
      if(typeof cordova != "undefined") {
        if(cordova.InAppBrowser) {
          var browserRef = cordova.InAppBrowser.open('https://github.com/login/oauth/authorize?client_id=' + this.clientId + '&redirect_uri=' + this.redirect_uri, '_blank', 'location=no,clearsessioncache=yes,clearcache=yes');
          browserRef.addEventListener('loadstart', (event:any) => {
            if((event.url).indexOf(this.redirect_uri) === 0) {
              this.requestToken = (event.url).split("code=")[1];
              resolve()
              browserRef.close()
            }
          });
          browserRef.addEventListener('exit', function(event) {
            reject("The sign in flow was canceled");
          });
        }
        else {
          reject("Could not find InAppBrowser plugin");
        }
      }
      else {
        reject("Cannot authenticate via a web browser");
      }
    })
  }

  authenticate() {
    let headers = new Headers({'Accept':'application/json'})
    let options = new RequestOptions({headers:headers})
    let query  = "client_id=" + this.clientId + "&client_secret=" + this.clientSecret + "&redirect_uri=" + this.redirect_uri + "&code=" + this.requestToken
    return this.http.post('https://github.com/login/oauth/access_token?' + query,'', options)
    .catch((err) => {
      return Observable.throw(err)
    })
    .map((res) => {
      var data = res.json()
      this.token = data.access_token
      this.updateLocalStorage()
      return data
    })
  }

  updateLocalStorage() {
    localStorage['token'] = this.token
  }
}

import {NavController} from 'ionic-angular'
import {Component} from "@angular/core";
import {Observable} from 'rxjs'

import {GithubLogin} from '../../services/githublogin'

import {HomePage} from '../home-page/home-page'

@Component({
  templateUrl: 'build/pages/login-page/login-page.html'
})
export class LoginPage {
  constructor(
    private nav:NavController,
    private githubLogin:GithubLogin
  ) {
    this.message = 'Waiting For User To be Authenticated'
    this.githubLogin.login()
    .then(() => {
      this.message = 'Authenticating...'
      this.githubLogin.authenticate()
      .catch((err) => {
        this.message = 'Some Error Occured'
        return Observable.throw(err)
      })
      .subscribe(() => {
        this.nav.setRoot(HomePage)
        this.message = 'Successfully Authenticated'
      })
    })
    .catch(msg => {
      this.message = msg
    })
  }

  message:string
}

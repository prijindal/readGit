import {Component} from "@angular/core";
import {NavController, NavParams, Alert} from 'ionic-angular';
import {Observable} from 'rxjs'

declare var Connection:any;

import {GithubLogin} from '../../services/githublogin'
import {UserService} from '../../services/user'

import {LoginPage} from '../login-page/login-page'

@Component({
  templateUrl: 'build/pages/home-page/home-page.html'
})
export class HomePage {
  constructor(
    private nav: NavController,
    private githubLogin:GithubLogin,
    private userService:UserService
  ) {
    if(!this.githubLogin.token) {
      this.nav.setRoot(LoginPage)
      return ;
    }
    this.userService.getUserData()
    .catch((err) => {
      if(err.status == 401) {
        this.nav.setRoot(LoginPage)
      }
      return Observable.throw(err)
    })
    .subscribe((res) => {})
    this.checkNetwork()
  }

  checkNetwork() {
    if(navigator && navigator['connection'] && Connection) {
      if(navigator['connection'].type == Connection.NONE) {
        alert('No network Connection')
      }
    }
  }
}

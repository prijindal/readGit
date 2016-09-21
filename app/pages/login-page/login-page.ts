import {NavController} from 'ionic-angular';
import {Component} from '@angular/core';

import {GithubLogin} from '../../services/githublogin';

import {HomePage} from '../home-page/home-page';

@Component({
  templateUrl: 'build/pages/login-page/login-page.html'
})
export class LoginPage {
  public message: string;

  constructor(
    private nav: NavController,
    private githubLogin: GithubLogin
  ) { }

  ionViewWillEnter() {
    this.message = 'Waiting For User To be Authenticated';
    this.githubLogin.login()
    .then(() => {
      this.message = 'Successfully Authenticated';
      this.nav.setRoot(HomePage);
    })
    .catch(msg => {
      this.message = msg;
    });
  }
}

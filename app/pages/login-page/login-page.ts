import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, Events} from 'ionic-angular';

import GithubLogin from '../../services/githublogin';
import OctokatService from '../../services/octokat';

import {HomePage} from '../home-page/home-page';
import {ErrorPage} from '../error-page/error-page';

@Component({
  templateUrl: 'build/pages/login-page/login-page.html'
})
export class LoginPage {
  private loading: Boolean = true;
  public message: string;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private events: Events,
    private githubLogin: GithubLogin,
    private octokat: OctokatService
  ) { }

  login() {
    this.message = 'Waiting For User To be Authenticated';
    this.githubLogin.login()
    .then(() => {
      this.message = 'Successfully Authenticated';
      this.verifyLogin();
    })
    .catch(err => {
      this.nav.push(ErrorPage, {error: err});
    });
  }

  ionViewWillEnter() {
    this.message = 'Waiting';
    this.verifyLogin();
  }

  verifyLogin() {
    this.loading = true;
    return this.octokat.checkLogin()
    .then(res => {
      this.message = 'Verifying You...';
      this.octokat.octo.me.read()
      .then(res => {
        this.message = 'Logged In';
        this.events.publish('login', true);
        this.nav.setRoot(HomePage, {user: JSON.parse(res)});
      })
      .catch(err => {
        this.nav.push(ErrorPage, {error: err});
      });
    })
    .catch(res => {
      this.loading = false;
      this.message = '';
    });
  }
}

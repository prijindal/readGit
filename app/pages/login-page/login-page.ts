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
  private waiting: Boolean = false;
  private acceptcode: Boolean = false;
  private message: string;
  private username: string;
  private password: string;
  private twofactor: string;
  private errorMessage: string;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private events: Events,
    private githubLogin: GithubLogin,
    private octokat: OctokatService
  ) { }

  login() {
    this.waiting = true;
    this.errorMessage = '';
    this.githubLogin.login(this.username, this.password, this.twofactor)
    .subscribe(() => {
      this.waiting = false;
      this.message = 'Successfully Authenticated';
      this.verifyLogin();
    }, (err) => {
      this.waiting = false;
      let errParsed = err.json();
      if (err.headers.get('X-GitHub-OTP') && err.headers.get('X-GitHub-OTP').search('required') === 0) {
        this.acceptcode = true;
      } else if (errParsed.message) {
        console.log(errParsed);
        this.errorMessage = errParsed.message;
      } else {
        this.nav.push(ErrorPage, {error: err});
      }
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
      this.ref.detectChanges();
    });
  }
}

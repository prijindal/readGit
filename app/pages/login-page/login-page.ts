import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController} from 'ionic-angular';

import GithubLogin from '../../services/githublogin';
import OctokatService from '../../services/octokat';

@Component({
  templateUrl: 'build/pages/login-page/login-page.html'
})
export class LoginPage {
  public message: string;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private githubLogin: GithubLogin,
    private octokat: OctokatService
  ) { }

  ionViewWillEnter() {
    this.message = 'Waiting';
    this.octokat.checkLogin()
    .then(res => {
      this.verifyLogin();
    })
    .catch(res => {
      this.message = 'Waiting For User To be Authenticated';
      this.githubLogin.login()
      .then(() => {
        this.message = 'Successfully Authenticated';
        this.verifyLogin();
      })
      .catch(msg => {
        this.message = msg;
      });
    });
  }

  verifyLogin() {
    this.message = 'Verifying You...';
    return this.octokat.octo.me.read()
    .then(res => {
      this.message = 'Logged In';
      this.ref.detectChanges();
      console.dir(JSON.parse(res));
    });
  }
}

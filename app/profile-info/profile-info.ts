import { Component, Input } from '@angular/core';

import { MenuController, Nav } from 'ionic-angular';

import OctokatService from '../services/octokat';
import GithubLogin from '../services/githublogin';

import { LoginPage } from '../pages/login-page/login-page';

@Component({
  selector: 'profile-info',
  templateUrl: 'build/profile-info/profile-info.html'
})
export class ProfileInfo {
  @Input()
  nav: Nav;
  user: any;

  constructor(
    private menu: MenuController,
    private octokat: OctokatService,
    private githubLogin: GithubLogin
  ) {}

  ngOnInit() {
    this.octokat.octo.me.fetch()
    .then(res => {
      this.user = res;
    });
  }

  goToProfile() {
    this.menu.close()
    .then(() => {
      // this.nav.push(UserPage);
    });
  }

  logout() {
    this.menu.close()
    .then(() => {
      this.octokat.logout()
      .then(() => {
        this.githubLogin.logout();
        this.nav.setRoot(LoginPage);
      });
    });
  }
}

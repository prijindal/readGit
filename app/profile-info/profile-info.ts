import { Component, Input } from '@angular/core';

import { MenuController, Nav } from 'ionic-angular';

import OctokatService from '../services/octokat';

import { LoginPage } from '../pages/login-page/login-page';
import { UserPage } from '../pages/user-page/user-page';

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
    private octokat: OctokatService
  ) {}

  ngOnInit() {
    this.octokat.octo.me.read()
    .then(res => {
      this.user = JSON.parse(res);
    });
  }

  goToProfile() {
    this.menu.close()
    .then(() => {
      this.nav.push(UserPage, {user: this.user});
    });
  }

  logout() {
    this.menu.close()
    .then(() => {
      this.octokat.logout()
      .then(() => {
        this.nav.setRoot(LoginPage);
      });
    });
  }
}

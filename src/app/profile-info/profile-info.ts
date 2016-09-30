import { Component, Input } from '@angular/core';

import { MenuController, Nav } from 'ionic-angular';

import {OctokatService} from '../../providers/octokat';

import { HomePage } from '../../pages/home-page/home-page';
import { UserPage } from '../../pages/user-page/user-page';

@Component({
  selector: 'profile-info',
  templateUrl: 'profile-info.html'
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
    this.user = this.octokat.userData;
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
        this.nav.setRoot(HomePage);
      });
    });
  }
}

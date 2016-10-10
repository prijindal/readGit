import { Component, Input } from '@angular/core';
import { MenuController, Nav } from 'ionic-angular';

import {FileService} from '../../providers/filehttp';
import {OcticonService} from '../../providers/octicon';

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
    private octicon: OcticonService,
    private menu: MenuController,

    private filehttp: FileService
  ) {}

  ngOnInit() {
    this.user = this.filehttp.userData;
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
      this.filehttp.logout()
      .then(() => {
        this.nav.setRoot(HomePage);
      });
    });
  }
}

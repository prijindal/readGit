import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

import {UserPage} from '../../pages/user-page/user-page';

@Component({
  selector: 'user-info',
  templateUrl: 'user-info.html'
})
export class UserInfo {
  @Input()
  user: any;

  constructor(
    private nav: NavController
  ) {}

  openUser() {
    this.nav.push(UserPage, {username: this.user.login})
  }
}

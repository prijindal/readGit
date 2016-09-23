import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, NavParams, PopoverController} from 'ionic-angular';

import OctokatService from '../../services/octokat';
import BrowserService from '../../services/browser';

import { ErrorPage } from '../error-page/error-page';

import { Popover } from './popover/popover';

@Component({
  templateUrl: 'build/pages/user-page/user-page.html'
})
export class UserPage {
  public loading: Boolean = true;
  private user: any;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,
    private popoverCtrl: PopoverController,
    private octokat: OctokatService,
    private browser: BrowserService
  ) { }

  ionViewWillEnter() {
    let user = this.params.get('user');
    if (user) {
      this.loading = false;
      this.user = user;
      this.getUserInfo();
    } else {
      this.loading = false;
      this.nav.push(ErrorPage, {error: {message: 'Problem with Authentication'}});
    }
  }

  getUserInfo() {
    this.loading = true;
    this.octokat.octo.fromUrl(this.user.url)
    .read()
    .then(res => {
      this.loading = false;
      this.user = JSON.parse(res);
    })
    .catch(err => {
      this.loading = false;
      this.nav.push(ErrorPage, {error: {message: 'Problem with Authentication'}});
    });
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(Popover);
    popover.present({
      ev: event
    });
  }
}

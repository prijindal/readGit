import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, NavParams, PopoverController} from 'ionic-angular';

import OctokatService from '../../services/octokat';

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
    private octokat: OctokatService
  ) { }

  ionViewWillEnter() {
    let user = this.params.get('user');
    if (user) {
      this.loading = false;
      this.user = user;
    }
    this.getUserInfo();
  }

  getUserInfo() {
    this.loading = true;
    this.octokat.octo.me.fetch()
    .then(res => {
      this.loading = false;
      this.user = res;
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

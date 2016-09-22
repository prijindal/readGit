import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, NavParams, PopoverController} from 'ionic-angular';

import OctokatService from '../../services/octokat';

import { ErrorPage } from '../error-page/error-page';

import { Popover } from './popover/popover';

@Component({
  templateUrl: 'build/pages/notifications-page/notifications-page.html'
})
export class NotificationsPage {
  public loading: Boolean = true;
  public notifications: any = [];

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,
    private popoverCtrl: PopoverController,
    private octokat: OctokatService
  ) { }

  ionViewWillEnter() {
    this.getNotifications();
  }

  getNotifications() {
    this.loading = true;
    this.octokat.octo.notifications.read()
    .then(res => {
      this.loading = false;
      this.notifications = JSON.parse(res);
      this.ref.detectChanges();
    })
    .catch(err => {
      this.nav.push(ErrorPage, {error: err});
    });
  }

  openRepository(notification) {
    window.open(notification.repository.html_url, '_system');
  }

  openNotification(notification) {
    this.octokat.octo.fromUrl(notification.subject.url)
    .fetch()
    .then(res => {
      console.dir(res);
      window.open(res.htmlUrl, '_system');
    });
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(Popover);
    popover.present({
      ev: event
    });
  }
}

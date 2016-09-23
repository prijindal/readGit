import {Component, ChangeDetectorRef, ViewChild} from '@angular/core';
import {NavController, NavParams, PopoverController} from 'ionic-angular';

import OctokatService from '../../services/octokat';

import { ErrorPage } from '../error-page/error-page';
import { RepoPage } from '../repo-page/repo-page';

import { Popover } from './popover/popover';

const PER_PAGE: number = 10;
const LIMIT: number = 300;

@Component({
  templateUrl: 'build/pages/notifications-page/notifications-page.html'
})
export class NotificationsPage {
  @ViewChild('notificationsContent') homeContent;
  public loading: Boolean = true;
  public notifications: any = [];
  private page: number = 1;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,
    private popoverCtrl: PopoverController,
    private octokat: OctokatService
  ) { }

  ionViewWillEnter() {
    this.refreshEvents();
  }

  refreshEvents() {
    this.loading = true;
    this.page = 1;
    this.getNotifications(true)
    .then(() => {
      this.loading = false;
    });
  }

  getNotifications(shouldRefresh: Boolean = false) {
    return this.octokat.octo.fromUrl('/notifications' + '?page=' + this.page + '&per_page=' + PER_PAGE).read()
    .then(res => {
      res = JSON.parse(res);
      if (shouldRefresh) {
        this.homeContent.scrollTo(0, 0);
        this.notifications = [];
      }
      res.forEach((notification) => {
        this.notifications.push(notification);
      });
      this.ref.detectChanges();
      return res;
    })
    .catch(err => {
      this.nav.push(ErrorPage, {error: err});
    });
  }

  doInfinite(infiniteScroll) {
    this.page += 1;
    if (this.page <= LIMIT / PER_PAGE) {
      this.getNotifications()
      .then(() => {
        infiniteScroll.complete();
      });
    } else {
      infiniteScroll.enable(false);
    }
  }

  openRepository(notification) {
    this.nav.push(RepoPage, {repo: notification.repository});
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

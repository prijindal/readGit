import {Component, ChangeDetectorRef, ViewChild} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {OctokatService} from '../../services/octokat';
import {UrlParser} from '../../services/urlparser';

import { ErrorPage } from '../error-page/error-page';
import { RepoPage } from '../repo-page/repo-page';



const PER_PAGE: number = 10;
const LIMIT: number = 300;

@Component({
  templateUrl: 'notifications-page.html'
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

    private octokat: OctokatService,
    private urlparser: UrlParser
  ) { }

  ionViewWillEnter() {
    this.refreshNotifications();
  }

  refreshNotifications() {
    this.loading = true;
    this.page = 1;
    this.getNotifications(true)
    .then(() => {
      this.loading = false;
    });
  }

  getNotifications(shouldRefresh: Boolean = false) {
    return this.octokat.octo.fromUrl('/notifications' + '?page=' + this.page + '&per_page=' + PER_PAGE + '&timestamp=' + new Date().getTime()).read()
    .then(res => {
      res = JSON.parse(res);
      if (shouldRefresh) {
        this.notifications = [];
      }
      res.forEach((notification) => {
        this.octokat.octo.fromUrl(notification.subject.url)
        .read()
        .then(notificationResponse => {
          notificationResponse = JSON.parse(notificationResponse);
          notification.response = notificationResponse;
          this.notifications.push(notification);
        });
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
      .then((res) => {
        infiniteScroll.complete();
        if (res.length < PER_PAGE) {
          infiniteScroll.enable(false);
        }
      });
    } else {
      infiniteScroll.enable(false);
    }
  }

  openRepository(notification) {
    this.nav.push(RepoPage, {repo: notification.repository});
  }

  openNotification(notification) {
    this.octokat.octo.notifications.threads(notification.id)
    .update()
    .then(res => {});
    this.urlparser.openUrl(this.nav, notification.response.html_url);
  }
}

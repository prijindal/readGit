import {Component, ChangeDetectorRef, ViewChild} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {OctokatService} from '../../providers/octokat';
import {FileService} from '../../providers/filehttp';
import {NotificationsService} from '../../providers/notifications';
import {UrlParser} from '../../providers/urlparser';

@Component({
  selector: 'notifications-page',
  templateUrl: 'notifications-page.html'
})
export class NotificationsPage {
  @ViewChild('notificationsContent') homeContent;
  public loading: Boolean = true;
  public notifications: any = [];
  public more: number;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,

    private octokat: OctokatService,
    private urlparser: UrlParser,
    private filehttp: FileService,
    private notificationsService: NotificationsService
  ) { }

  ionViewWillEnter() {
    if (this.notifications.length === 0) {
      this.refreshNotifications();
    }
  }

  refreshNotifications() {
    this.loading = true;
    this.notificationsService.getNotifications()
    .then((response: any) => {
      this.notifications = response.notifications
      this.more = response.more
      this.loading = false;
    })
  }

  loadMore() {
    let count = 0;
    this.notifications.forEach((notification) => {
      count+=notification.notifications.length + notification.more;
    })
    this.notificationsService.getNotifications(count)
    .then((response: any) => {
      this.notifications = response.notifications
      this.more = response.more
      this.loading = false;
    })
  }

  loadPartialMore(notificationInfo) {
    this.notificationsService.getRepoNotifications(notificationInfo)
    .then(notifications => {
      notificationInfo.notifications = notifications
      notificationInfo.more = 0;
      for(let i = 0;i < this.notifications.length; ++i) {
        if (this.notifications[i].repository === notificationInfo.repository) {
          this.notifications[i] = notificationInfo;
        }
      }
    })
  }

  markRead(notification) {
    notification.unread = false;
    this.octokat.octo.notifications.threads(notification.id)
    .update()
    .then(res => {});
  }

  openNotification(notification) {
    this.markRead(notification);
    this.urlparser.openUrl(this.nav, this.notificationsService.getHtmlUrl(notification));
  }
}

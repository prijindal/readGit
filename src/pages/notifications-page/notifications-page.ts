import {Component, ChangeDetectorRef, ViewChild} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';

import {RepoPage} from '../repo-page/repo-page/';

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
    private alertCtrl: AlertController,

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
    return this.notificationsService.getNotifications()
    .then((response: any) => {
      this.notifications = response.notifications
      this.more = response.more
      this.loading = false;
      return response;
    })
  }

  doRefresh(refresher) {
    this.refreshNotifications()
    .then(() => {
      refresher.complete();
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

  openRepo(notificationInfo) {
    this.nav.push(RepoPage, {repo: notificationInfo.notifications[0].repository})
  }

  markRepoRead(notificationInfo) {
    this.alertCtrl.create({
      title: 'Are you sure',
      message: 'All Notifications of ' + notificationInfo.repository + ' will be cleared.',
      buttons: [{
        text: 'No',
        action: 'cancel',
        handler:() => {}
      }, {
        text: 'Yes',
        handler: () => {
          notificationInfo.notifications.forEach(notification => {
              this.markRead(notification);
          });
        }
      }]
    })
  }
}

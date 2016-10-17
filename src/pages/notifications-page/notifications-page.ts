import {Component, ChangeDetectorRef, ViewChild} from '@angular/core';
import {NavController, NavParams, AlertController, PopoverController} from 'ionic-angular';

import {RepoPage} from '../repo-page/repo-page';

import {NotificationsPopover} from './notifications-popover/notifications-popover';


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
  private query: string = '';
  public more: number;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,
    private alertCtrl: AlertController,
    private popoverCtrl: PopoverController,


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
    return this.notificationsService.getNotifications(50, this.query)
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
    this.notificationsService.getNotifications(count, this.query)
    .then((response: any) => {
      this.notifications = response.notifications
      this.more = response.more
      this.loading = false;
    })
  }

  loadPartialMore(notificationInfo) {
    this.notificationsService.getRepoNotifications(notificationInfo, this.query)
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
    this.filehttp.patchRequest(notification.url, {})
    .then(res => {});
  }

  openNotification(notification) {
    this.markRead(notification);
    this.urlparser.openUrl(this.nav, this.notificationsService.getHtmlUrl(notification));
  }

  openRepo(notificationInfo) {
    this.nav.push(RepoPage, {reponame: notificationInfo.notifications[0].repository.full_name})
  }

  markRepoRead(notificationInfo) {
    let prompt = this.alertCtrl.create({
      title: 'Are you sure',
      message: 'All Notifications of ' + notificationInfo.repository + ' will be cleared.',
      buttons: [{
        text: 'No',
        action: 'cancel',
        handler:() => {}
      }, {
        text: 'Yes',
        handler: () => {
          this.filehttp.putRequest('/repos/' + notificationInfo.repository + '/notifications', {})
          .then(res => {});
          notificationInfo.notifications.forEach(notification => {
            notification.unread = false;
          });
        }
      }]
    })
    prompt.present({ev: event});
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(NotificationsPopover, {current: this.query})
    popover.onDidDismiss(current => {
      this.query = current;
      this.notifications = [];
      this.more = 0;
      this.refreshNotifications();
    })
    popover.present({ev: event});
  }
}

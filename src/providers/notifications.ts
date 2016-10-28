import { Injectable } from '@angular/core';

import {FileService} from './filehttp';
import async from 'async';

declare interface ParsedNotification {
  repository: string;
  more: number;
  notifications: [Object];
}

@Injectable()
export class NotificationsService {
  constructor(
    public filehttp: FileService
  ) {}

  getHtmlUrl(notification) {
    return notification.subject.url.replace('https://api.github.com/repos', 'https://github.com');
  }

  getNotifications(loadCount: number = 50, query: string = '') {
    return new Promise((resolve, reject) => {
      this.filehttp.getFileFromUrl('/notifications?page=1&per_page=' + loadCount + query + '&timestamp=' + new Date().getTime())
      .then((response) => {
        let linkHeader = response.headers.get('Link');
        let notificationsArray = response.json();
        let notificationsCount = notificationsArray.length;
        let notifications: ParsedNotification[] = [];
        notificationsArray.forEach(notification => {
          let repository = notification.repository;
          for (var i = 0;i < notifications.length; ++i) {
            if (repository.full_name === notifications[i].repository) {
              notifications[i].notifications.push(notification)
              return ;
            }
          }
          notifications.push({
            repository: repository.full_name,
            more: 0,
            notifications: [notification]
          })
        });
        // Parse notificationsArray
        if (linkHeader && notificationsCount >= loadCount) {
          this.filehttp.getHeaders('/notifications?page=1&per_page=1' + query)
          .then(headerResponse => {
            let counted = 0;
            let headerNotificationsCount = this.filehttp.getLinkLength(headerResponse);
            async.eachSeries(notifications, (notification, callback) => {
              this.filehttp.getHeaders('/repos/' + notification.repository + '/notifications?page=1&per_page=1' + query)
              .then(repoNotifications => {
                let repoNotificationsCount = this.filehttp.getLinkLength(repoNotifications);
                if (!repoNotificationsCount) repoNotificationsCount = 1;
                notification.more = repoNotificationsCount - notification.notifications.length
                counted+=repoNotificationsCount;
                callback();
              })
            }, () => {
              return resolve({notifications, more: headerNotificationsCount - counted});
            });
          });
        } else {
          return resolve({notifications, more: 0});
        }
      })
    })
  }

  getRepoNotifications(notificationInfo, query: string = '') {
    return new Promise((resolve, reject) => {
      let count = notificationInfo.notifications.length + notificationInfo.more
      this.filehttp.getFileFromUrl('/repos/' + notificationInfo.repository + '/notifications?page=1&per_page=' + count + query)
      .then(res => {
        let notifications = res.json();
        resolve(notifications)
      })
    })
  }

  setUpNotifications() {
    if (
      window['cordova'] &&
      window['cordova'].plugins &&
      window['cordova'].plugins.notification &&
      window['cordova'].plugins.notification.local &&
      window['cordova'].plugins.notification.local &&
      window['cordova'].plugins.backgroundMode
    ) {
      window['cordova'].plugins.notification.local.hasPermission((granted) => {
        if (granted) {
          this.startUpdating();
        } else {
          window['cordova'].plugins.notification.local.registerPermission((granted) => {
            this.startUpdating();
          });
        }
      });
    }
  }

  private startUpdating() {
    window['cordova'].plugins.backgroundMode.enable();
    setInterval(() => {
      this.updateNotifications()
    }, 10000)
  }

  private updateNotifications() {
    this.filehttp.getHeaders('/notifications?page=1&per_page=1' + '&timestamp=' + new Date().getTime())
    .then(headerResponse => {
      let headerNotificationsCount = this.filehttp.getLinkLength(headerResponse);
      if(headerNotificationsCount > 0) {
        this.filehttp.getFileFromUrl('/notifications?page=1&per_page=' + headerNotificationsCount + '&timestamp=' + new Date().getTime())
        .then(response => {
          console.dir(response)
          window['cordova'].plugins.notification.local.schedule
        })
      }
    })
  }
}

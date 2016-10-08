import { Component } from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';

@Component({
  template: `
    <ion-list>
      <ion-list-header>Categories</ion-list-header>
      <button ion-item (click)="close('')">View Unread</button>
      <button ion-item (click)="close('participating=true')">View Participating</button>
      <button ion-item (click)="close('all=true')">View All</button>
    </ion-list>
  `
})
export class NotificationsPopover {
  public current: string;

  constructor(
    public viewCtrl: ViewController,
    private params: NavParams
  ) {
    this.current = params.get('current')
  }

  close(path) {
    if (path) {
      path = '&' + path;
    } else {
      path = '';
    }
    this.viewCtrl.dismiss(path);
  }
}

import { Component } from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';

@Component({
  template: `
    <ion-list>
      <button ion-item *ngIf="!subscribed" (click)="close(true)">Subscribe</button>
      <button ion-item *ngIf="subscribed" (click)="close(false)">Unsubscribe</button>
    </ion-list>
  `
})
export class IssuePopover {
  public subscribed: Boolean;

  constructor(
    public viewCtrl: ViewController,
    private params: NavParams
  ) {
    this.subscribed = params.get('subscribed')
  }

  close(subscribed) {
    this.subscribed = subscribed;
    this.viewCtrl.dismiss(subscribed);
  }
}

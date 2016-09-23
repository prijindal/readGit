import { Component } from '@angular/core';
import { ViewController, Platform } from 'ionic-angular';

@Component({
  template: `
    <ion-list>
      <ion-list-header>Ionic</ion-list-header>
      <button ion-item (click)="close()">Learn Ionic</button>
      <button ion-item (click)="close()">Documentation</button>
      <button ion-item (click)="close()">Showcase</button>
      <button ion-item (click)="close()">GitHub Repo</button>
    </ion-list>
  `
})
export class Popover {
  private sub: any;

  constructor(
    private viewCtrl: ViewController,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.sub = this.platform.registerBackButtonAction(() => {
      this.close();
    });
  }

  ngOnDestroy() {
    this.sub();
  }

  close() {
    this.viewCtrl.dismiss();
  }
}

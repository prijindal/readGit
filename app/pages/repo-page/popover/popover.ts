import { Component } from '@angular/core';
import { ViewController, Platform, NavParams } from 'ionic-angular';

import BrowserService from '../../../services/browser';

@Component({
  template: `
    <ion-list>
      <ion-list-header>Ionic</ion-list-header>
      <button ion-item (click)="openMilestonesPage()">Milestones</button>
      <button ion-item (click)="openReleasesPage()">Releases</button>
      <button ion-item (click)="openContributorsPage()">Contributors</button>
      <button *ngIf="repo.permissions && repo.permissions.admin" ion-item (click)="openCollabaratorsPage()">Collabarators</button>
    </ion-list>
  `
})
export class Popover {
  private sub: any;
  public repo: any;

  constructor(
    private viewCtrl: ViewController,
    private platform: Platform,
    private params: NavParams,
    private browser: BrowserService
  ) {}

  ngOnInit() {
    this.repo = this.params.get('repo');
    this.sub = this.platform.registerBackButtonAction(() => {
      this.close();
    });
  }

  ngOnDestroy() {
    this.sub();
  }

  openMilestonesPage() {
    this.browser.open(this.repo.html_url + '/milestones');
  }

  openReleasesPage() {
    this.browser.open(this.repo.html_url + '/releases');
  }

  openContributorsPage() {
    this.browser.open(this.repo.html_url + '/contributors');
  }

  openCollabaratorsPage() {
    this.browser.open(this.repo.html_url + '/settings/collaboration');
  }

  close() {
    this.viewCtrl.dismiss();
  }
}

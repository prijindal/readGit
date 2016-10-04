import { Component } from '@angular/core';
import {ViewController} from 'ionic-angular';

import {ReleasesPage} from '../../releases-page/releases-page';

@Component({
  template: `
    <ion-list>
      <button ion-item (click)="openReleases()">View Releases</button>
    </ion-list>
  `
})
export class RepoPopover {
  constructor(
    public viewCtrl: ViewController
  ) {}

  openReleases() {
    this.close(ReleasesPage);
  }

  close(ReleasesPage) {
    this.viewCtrl.dismiss(ReleasesPage);
  }
}

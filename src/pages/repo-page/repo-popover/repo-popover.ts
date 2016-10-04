import { Component } from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';

import {ReleasesPage} from '../../releases-page/releases-page';
import {FileService} from '../../../providers/filehttp';

@Component({
  template: `
    <ion-list>
      <button ion-item (click)="openReleases()">
        View Releases
        <span item-right>{{releases}}</span>
      </button>
      <button ion-item (click)="openMilestones()">
        View Milestones
        <span item-right>{{milestones}}</span>
      </button>
    </ion-list>
  `
})
export class RepoPopover {
  url: string;
  releases: number;
  milestones: number;
  constructor(
    public viewCtrl: ViewController,
    private params: NavParams,
    private filehttp: FileService
  ) {
    this.url = params.get('url');
    this.getReleases();
    this.getMilestones();
  }

  getReleases() {
    this.filehttp.getHeaders(this.url + '/releases?page=1&per_page=1')
    .then(res => {
      this.releases = this.filehttp.getLinkLength(res);
    });
  }

  getMilestones() {
    this.filehttp.getHeaders(this.url + '/milestones?page=1&per_page=1')
    .then(res => {
      this.milestones = this.filehttp.getLinkLength(res);
    });
  }

  openReleases() {
    this.close(ReleasesPage);
  }

  openMilestones() {
    // this.close(MilestonesPage);
  }

  close(ReleasesPage) {
    this.viewCtrl.dismiss(ReleasesPage);
  }
}

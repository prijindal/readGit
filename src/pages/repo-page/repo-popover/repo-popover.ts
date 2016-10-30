import { Component } from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';

import {ReleasesPage} from '../../releases-page/releases-page';
import {MilestonesPage} from '../../milestones-page/milestones-page';
import {ProjectsPage} from '../../projects-page/projects-page';
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
      <button ion-item (click)="openProjects()">
        View Projects
        <span item-right>{{projects}}</span>
      </button>
    </ion-list>
  `
})
export class RepoPopover {
  username: string;
  reponame: string;
  releases: number;
  milestones: number;
  projects: number;
  constructor(
    public viewCtrl: ViewController,
    private params: NavParams,
    private filehttp: FileService
  ) {
    this.username = params.get('username');
    this.reponame = params.get('reponame');
    this.releases = params.get('releasesCount');
    this.projects = params.get('projectsCount');
    this.getMilestones();
  }

  getMilestones() {
    this.filehttp.getHeaders('https://api.github.com/repos/' + this.username + '/' + this.reponame + '/milestones?page=1&per_page=1')
    .then(res => {
      this.milestones = this.filehttp.getLinkLength(res);
    });
  }

  openReleases() {
    this.close(ReleasesPage);
  }

  openMilestones() {
    this.close(MilestonesPage);
  }

  openProjects() {
    this.close(ProjectsPage);
  }

  close(ReleasesPage) {
    this.viewCtrl.dismiss(ReleasesPage);
  }
}

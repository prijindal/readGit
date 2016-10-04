import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import moment from 'moment';

import {FileService} from '../../providers/filehttp';

const PER_PAGE: number = 5;

@Component({
  selector: 'releases-page',
  templateUrl: 'releases-page.html'
})
export class ReleasesPage {
  public page: number = 1;
  public repo: string;
  public releases: any = [];

  constructor(
    private nav: NavController,
    private params: NavParams,
    private filehttp: FileService
  ) {}

  ionViewWillEnter() {
    this.repo = this.params.get('repo');
    if (this.releases.length === 0) {
      this.page = 1;
      this.getReleases();
    }
  }

  getReleases() {
    return this.filehttp.getFileFromUrl('https://api.github.com/repos/' + this.repo + '/releases?page=' + this.page + '&per_page=' + PER_PAGE, 'html')
    .then(res => {
      let releases = res.json();
      releases.forEach(release => {
          this.releases.push(release);
      });
      return releases;
    })
  }

  doInfinite(infiniteScroll) {
    this.page += 1;
    this.getReleases()
    .then((res) => {
      infiniteScroll.complete();
      if (res.length < PER_PAGE) {
        infiniteScroll.enable(false);
      }
    });
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }
}

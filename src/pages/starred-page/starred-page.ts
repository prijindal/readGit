import {Component, ChangeDetectorRef, ViewChild} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {OctokatService} from '../../providers/octokat';
import {FileService} from '../../providers/filehttp';

import { RepoPage } from '../repo-page/repo-page';


const PER_PAGE: number = 10000;

@Component({
  templateUrl: 'starred-page.html'
})
export class StarredPage {
  @ViewChild('starredContent') homeContent;
  public loading: Boolean = true;
  public starred: any = [];
  public user: string;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,

    private octokat: OctokatService,
    private filehttp: FileService
  ) { }

  ionViewWillEnter() {
    this.user = this.params.get('user');
    if (!this.user || this.user === this.octokat.user) {
      this.user = 'user';
    } else {
      this.user = 'users/' + this.user;
    }
    this.getStarred();
  }

  getStarred() {
    return this.filehttp.getFileFromUrl('/' + this.user + '/starred' + '?per_page=' + PER_PAGE)
    .then(res => {
      this.starred = res.json();
      this.ref.detectChanges();
      return this.starred;
    })
    .catch(err => {
      this.filehttp.handleError(err);
    });
  }

  openRepository(repo) {
    this.nav.push(RepoPage, {repo: repo});
  }
}

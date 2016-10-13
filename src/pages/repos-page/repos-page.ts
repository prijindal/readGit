import {Component, ChangeDetectorRef, ViewChild} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';


import {FileService} from '../../providers/filehttp';

import { RepoPage } from '../repo-page/repo-page';

const PER_PAGE: number = 30;

@Component({
  templateUrl: 'repos-page.html'
})
export class ReposPage {
  @ViewChild('reposContent') homeContent;
  public loading: Boolean = true;
  public repos: any = [];
  private page: number = 1;
  public user: string;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,


    private filehttp: FileService
  ) { }

  ionViewWillEnter() {
    this.user = this.params.get('user');
    if (!this.user || this.user === this.filehttp.user) {
      this.user = 'user';
    } else {
      this.user = 'users/' + this.user;
    }
    this.refreshRepos();
  }

  refreshRepos() {
    this.loading = true;
    this.page = 1;
    this.getRepos(true)
    .then(() => {
      this.loading = false;
    });
  }

  getRepos(shouldRefresh: Boolean = false) {
    return this.filehttp.getFileFromUrl('/' + this.user + '/repos' + '?sort=updated&page=' + this.page + '&per_page=' + PER_PAGE)
    .then(response => {
      let res = response.json();
      if (shouldRefresh) {
        this.repos = [];
      }
      res.forEach((notification) => {
        this.repos.push(notification);
      });
      this.ref.detectChanges();
      return res;
    })
    .catch(err => {
      this.filehttp.handleError(err);
    });
  }

  doInfinite(infiniteScroll) {
    this.page += 1;
    this.getRepos()
    .then((res) => {
      infiniteScroll.complete();
      if (res.length < PER_PAGE) {
        infiniteScroll.enable(false);
      }
    });
  }

  openRepository(repo) {
    this.nav.push(RepoPage, {reponame: repo.full_name});
  }
}

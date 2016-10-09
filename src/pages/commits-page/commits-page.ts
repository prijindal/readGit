import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import moment from 'moment';

import {OctokatService} from '../../providers/octokat';
import {FileService} from '../../providers/filehttp';
import {BrowserService} from '../../providers/browser';

import { CommitPage } from '../commit-page/commit-page';

const PER_PAGE: number = 60;

@Component({
  templateUrl: 'commits-page.html'
})
export class CommitsPage {
  public loading: Boolean = true;
  public commits: any = [];
  private page: number = 1;
  public repo: string;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,

    private octokat: OctokatService,
    private filehttp: FileService,
    private browser: BrowserService
  ) { }

  ionViewWillEnter() {
    this.repo = this.params.get('repo');
    if (!this.repo) {
      let username = this.params.get('username');
      let reponame = this.params.get('reponame');
      this.repo = username + '/' + reponame;
    }
    this.refreshCommits();
  }

  refreshCommits() {
    this.loading = true;
    this.page = 1;
    this.getCommits(true)
    .then(() => {
      this.loading = false;
    });
  }

  getCommits(shouldRefresh: Boolean = false) {
    return this.filehttp.getFileFromUrl('/repos/' + this.repo + '/commits' + '?page=' + this.page + '&per_page=' + PER_PAGE)
    .then(response => {
      let res = response.json();
      if (shouldRefresh) {
        this.commits = [];
      }
      res.forEach((commit) => {
        this.commits.push(commit);
      });
      this.ref.detectChanges();
      return res;
    })
    .catch(err => {
      this.filehttp.handleError(err);
    });
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }

  doInfinite(infiniteScroll) {
    this.page += 1;
    this.getCommits()
    .then((res) => {
      infiniteScroll.complete();
      if (res.length < PER_PAGE) {
        infiniteScroll.enable(false);
      }
    });
  }

  openCommit(commit) {
    this.nav.push(CommitPage, {commit: commit});
  }
}

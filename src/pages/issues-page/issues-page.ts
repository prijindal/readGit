import {Component, ChangeDetectorRef, ViewChild} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import moment from 'moment';


import {FileService} from '../../providers/filehttp';
import {BrowserService} from '../../providers/browser';

import { IssuePage } from '../issue-page/issue-page';

const PER_PAGE: number = 30;

@Component({
  templateUrl: 'issues-page.html'
})
export class IssuesPage {
  @ViewChild('issuesContent') homeContent;
  public loading: Boolean = true;
  public issues: any = [];
  private page: number = 1;
  public repo: string;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,

    
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
    this.refreshIssues();
  }

  refreshIssues() {
    this.loading = true;
    this.page = 1;
    this.getIssues(true)
    .then(() => {
      this.loading = false;
    });
  }

  getIssues(shouldRefresh: Boolean = false) {
    return this.filehttp.getFileFromUrl('/repos/' + this.repo + '/issues' + '?page=' + this.page + '&per_page=' + PER_PAGE)
    .then(response => {
      let res = response.json();
      if (shouldRefresh) {
        this.issues = [];
      }
      res.forEach((notification) => {
        this.issues.push(notification);
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
    this.getIssues()
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

  openIssue(issue) {
    this.nav.push(IssuePage, {issue: issue});
  }
}

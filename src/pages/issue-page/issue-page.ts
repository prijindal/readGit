import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import moment from 'moment';

import {OctokatService} from '../../providers/octokat';
import {FileService} from '../../providers/filehttp';
import {BrowserService} from '../../providers/browser';

import { ErrorPage } from '../error-page/error-page';



@Component({
  templateUrl: 'issue-page.html'
})
export class IssuePage {
  public loading: Boolean = true;
  public issue: any;
  public comments: any;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,

    private octokat: OctokatService,
    private filehttp: FileService,
    private browser: BrowserService
  ) { }

  ionViewWillEnter() {
    this.issue = this.params.get('issue');
    if (!this.issue) {
      let username = this.params.get('username');
      let reponame = this.params.get('reponame');
      let issuenumber = this.params.get('issuenumber');
      let url = 'https://api.github.com/repos/' + username + '/' + reponame + '/issues/' + issuenumber;
      this.issue = {url: url, number: issuenumber};
     }
    this.getIssue();
    this.getComments();
  }

  getIssue() {
    this.loading = true;
    this.filehttp.getFileFromUrl(this.issue.url, 'html')
    .then(res => {
      this.issue = res.json();
      this.loading = false;
      this.ref.detectChanges();
    })
    .catch(err => {
      this.nav.push(ErrorPage, {error: err});
    });
  }

  getComments() {
    this.filehttp.getFileFromUrl(this.issue.url + '/comments?per_page=10000', 'html')
    .then(res => {
      this.comments = res.json();
      this.ref.detectChanges();
    });
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }
}

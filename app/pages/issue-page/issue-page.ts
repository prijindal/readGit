import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, NavParams, PopoverController} from 'ionic-angular';

import * as moment from 'moment';

import OctokatService from '../../services/octokat';
import FileService from '../../services/filehttp';
import BrowserService from '../../services/browser';

import { ErrorPage } from '../error-page/error-page';

import { Popover } from './popover/popover';

@Component({
  templateUrl: 'build/pages/issue-page/issue-page.html'
})
export class IssuePage {
  public loading: Boolean = true;
  public issue: any;
  public comments: any;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,
    private popoverCtrl: PopoverController,
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
      let url = '/repos/' + username + '/' + reponame + '/issues/' + issuenumber;
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

  presentPopover(event) {
    let popover = this.popoverCtrl.create(Popover);
    popover.present({
      ev: event
    });
  }
}

import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, NavParams, PopoverController} from 'ionic-angular';

import * as moment from 'moment';

import OctokatService from '../../services/octokat';
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
    this.octokat.octo.fromUrl(this.issue.url)
    .read()
    .then(res => {
      res = JSON.parse(res);
      this.issue = res;
      this.loading = false;
      this.ref.detectChanges();
    })
    .catch(err => {
      this.nav.push(ErrorPage, {error: err});
    });
  }

  getComments() {
    this.octokat.octo.fromUrl(this.issue.url + '/comments?per_page=10000')
    .read()
    .then(res => {
      res = JSON.parse(res);
      this.comments = res;
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

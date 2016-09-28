import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, NavParams, PopoverController} from 'ionic-angular';

import moment from 'moment';

import OctokatService from '../../services/octokat';
import BrowserService from '../../services/browser';

import { ErrorPage } from '../error-page/error-page';
import { CommitPage } from '../commit-page/commit-page';

import { Popover } from './popover/popover';

const PER_PAGE: number = 60;

@Component({
  templateUrl: 'commits-page.html'
})
export class CommitsPage {
  public loading: Boolean = true;
  public commits: any = [];
  private page: number = 1;
  private repo: string;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,
    private popoverCtrl: PopoverController,
    private octokat: OctokatService,
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
    return this.octokat.octo.fromUrl('/repos/' + this.repo + '/commits' + '?page=' + this.page + '&per_page=' + PER_PAGE)
    .read()
    .then(res => {
      res = JSON.parse(res);
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
      this.nav.push(ErrorPage, {error: err});
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

  presentPopover(event) {
    let popover = this.popoverCtrl.create(Popover);
    popover.present({
      ev: event
    });
  }
}

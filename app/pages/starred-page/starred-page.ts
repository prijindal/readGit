import {Component, ChangeDetectorRef, ViewChild} from '@angular/core';
import {NavController, NavParams, PopoverController} from 'ionic-angular';

import OctokatService from '../../services/octokat';

import { ErrorPage } from '../error-page/error-page';
import { RepoPage } from '../repo-page/repo-page';

import { Popover } from './popover/popover';

const PER_PAGE: number = 30;
const LIMIT: number = 300;

@Component({
  templateUrl: 'build/pages/starred-page/starred-page.html'
})
export class StarredPage {
  @ViewChild('starredContent') homeContent;
  public loading: Boolean = true;
  public starred: any = [];
  private page: number = 1;
  private user: string;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,
    private popoverCtrl: PopoverController,
    private octokat: OctokatService
  ) { }

  ionViewWillEnter() {
    this.user = this.params.get('user');
    if (!this.user || this.user === this.octokat.user) {
      this.user = 'user';
    } else {
      this.user = 'users/' + this.user;
    }
    this.refreshEvents();
  }

  refreshEvents() {
    this.loading = true;
    this.page = 1;
    this.getStarred(true)
    .then(() => {
      this.loading = false;
    });
  }

  getStarred(shouldRefresh: Boolean = false) {
    return this.octokat.octo.fromUrl('/' + this.user + '/starred' + '?page=' + this.page + '&per_page=' + PER_PAGE).read()
    .then(res => {
      res = JSON.parse(res);
      if (shouldRefresh) {
        this.homeContent.scrollTo(0, 0);
        this.starred = [];
      }
      res.forEach((notification) => {
        this.starred.push(notification);
      });
      this.ref.detectChanges();
      return res;
    })
    .catch(err => {
      this.nav.push(ErrorPage, {error: err});
    });
  }

  doInfinite(infiniteScroll) {
    this.page += 1;
    if (this.page <= LIMIT / PER_PAGE) {
      this.getStarred()
      .then(() => {
        infiniteScroll.complete();
      });
    } else {
      infiniteScroll.enable(false);
    }
  }

  openRepository(repo) {
    this.nav.push(RepoPage, {repo: repo});
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(Popover);
    popover.present({
      ev: event
    });
  }
}

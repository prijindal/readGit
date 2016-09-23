import {Component, ChangeDetectorRef, ViewChild} from '@angular/core';
import {NavController, NavParams, PopoverController} from 'ionic-angular';

import OctokatService from '../../services/octokat';

import { ErrorPage } from '../error-page/error-page';
import { RepoPage } from '../repo-page/repo-page';

import { Popover } from './popover/popover';

const PER_PAGE: number = 30;
const LIMIT: number = 300;

@Component({
  templateUrl: 'build/pages/repos-page/repos-page.html'
})
export class ReposPage {
  @ViewChild('reposContent') homeContent;
  public loading: Boolean = true;
  public repos: any = [];
  private page: number = 1;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,
    private popoverCtrl: PopoverController,
    private octokat: OctokatService
  ) { }

  ionViewWillEnter() {
    this.refreshEvents();
  }

  refreshEvents() {
    this.loading = true;
    this.page = 1;
    this.getRepos(true)
    .then(() => {
      this.loading = false;
    });
  }

  getRepos(shouldRefresh: Boolean = false) {
    return this.octokat.octo.fromUrl('/user/repos' + '?page=' + this.page + '&per_page=' + PER_PAGE).read()
    .then(res => {
      res = JSON.parse(res);
      if (shouldRefresh) {
        this.homeContent.scrollTo(0, 0);
        this.repos = [];
      }
      res.forEach((notification) => {
        this.repos.push(notification);
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
      this.getRepos()
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
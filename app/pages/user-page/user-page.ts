import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, NavParams, PopoverController} from 'ionic-angular';

import OctokatService from '../../services/octokat';
import BrowserService from '../../services/browser';

import { ErrorPage } from '../error-page/error-page';
import { ReposPage } from '../repos-page/repos-page';
import { StarredPage } from '../starred-page/starred-page';
import { FollowersPage } from '../followers-page/followers-page';
import { FollowingPage } from '../following-page/following-page';
import { WatchedPage } from '../watched-page/watched-page';

import { Popover } from './popover/popover';

@Component({
  templateUrl: 'build/pages/user-page/user-page.html'
})
export class UserPage {
  public loading: Boolean = true;
  private user: any;
  public starred: number;
  public watching: number;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,
    private popoverCtrl: PopoverController,
    private octokat: OctokatService,
    private browser: BrowserService
  ) { }

  ionViewWillEnter() {
    let user = this.params.get('user');
    let username = this.params.get('username');
    if (user) {
      this.loading = false;
      this.user = user;
      this.getUserInfo();
    } else if (username) {
      this.user = {url: '/users/' + username, login: username};
      let tab = this.params.get('tab');
      if (tab) {
        this.nav.pop().then(() => {
          if (tab === 'repositories') {
            this.openReposPage();
          } else if (tab === 'stars') {
            this.openStarredPage();
          } else if (tab === 'followers') {
            this.openFollowersPage();
          } else if (tab === 'following') {
            this.openFollowingPage();
          } else {
            this.nav.push(ErrorPage, {error: {status: 404, message: 'Not Found'}});
          }
        });
        return ;
      }
      this.getUserInfo();
    } else {
      this.loading = false;
      this.nav.push(ErrorPage, {error: {message: 'Problem with Authentication'}});
    }
  }

  getUserInfo() {
    this.loading = true;
    this.octokat.octo.fromUrl(this.user.url)
    .read()
    .then(res => {
      this.loading = false;
      this.user = JSON.parse(res);
      this.octokat.octo.fromUrl(this.user.url + '/starred?per_page=10000')
      .read()
      .then(res => {
        res = JSON.parse(res);
        this.starred = res.length;
      });
      this.octokat.octo.fromUrl(this.user.url + '/subscriptions?per_page=10000')
      .read()
      .then(res => {
        res = JSON.parse(res);
        this.watching = res.length;
      });
    })
    .catch(err => {
      this.loading = false;
      this.nav.push(ErrorPage, {error: {message: 'Problem with Authentication'}});
    });
  }

  openReposPage() {
    this.nav.push(ReposPage, {user: this.user.login});
  }

  openStarredPage() {
    this.nav.push(StarredPage, {user: this.user.login});
  }

  openFollowersPage() {
    this.nav.push(FollowersPage, {user: this.user.login});
  }

  openFollowingPage() {
    this.nav.push(FollowingPage, {user: this.user.login});
  }

  openWatchingPage() {
    this.nav.push(WatchedPage, {user: this.user.login});
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(Popover);
    popover.present({
      ev: event
    });
  }
}

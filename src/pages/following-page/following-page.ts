import {Component, ChangeDetectorRef, ViewChild} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {OctokatService} from '../../providers/octokat';
import {FileService} from '../../providers/filehttp';

import { UserPage } from '../user-page/user-page';

const PER_PAGE: number = 30;
const LIMIT: number = 300;

@Component({
  templateUrl: 'following-page.html'
})
export class FollowingPage {
  @ViewChild('followingContent') homeContent;
  public loading: Boolean = true;
  public following: any = [];
  private page: number = 1;
  public user: string;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,

    private octokat: OctokatService,
    private filehttp: FileService
  ) { }

  ionViewWillEnter() {
    this.user = this.params.get('user');
    if (!this.user || this.user === this.octokat.user) {
      this.user = 'user';
    } else {
      this.user = 'users/' + this.user;
    }
    this.refreshFollowing();
  }

  refreshFollowing() {
    this.loading = true;
    this.page = 1;
    this.getFollowing(true)
    .then(() => {
      this.loading = false;
    });
  }

  getFollowing(shouldRefresh: Boolean = false) {
    return this.filehttp.getFileFromUrl('/' + this.user + '/following' + '?page=' + this.page + '&per_page=' + PER_PAGE)
    .then(response => {
      let res = response.json();
      if (shouldRefresh) {
        this.following = [];
      }
      res.forEach((notification) => {
        this.following.push(notification);
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
    if (this.page <= LIMIT / PER_PAGE) {
      this.getFollowing()
      .then((res) => {
        infiniteScroll.complete();
        if (res.length < PER_PAGE) {
          infiniteScroll.enable(false);
        }
      });
    } else {
      infiniteScroll.enable(false);
    }
  }

  openUser(user) {
    this.nav.push(UserPage, {user: user});
  }
}

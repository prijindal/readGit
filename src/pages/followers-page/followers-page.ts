import {Component, ChangeDetectorRef, ViewChild} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';


import {FileService} from '../../providers/filehttp';

import { UserPage } from '../user-page/user-page';

const PER_PAGE: number = 30;
const LIMIT: number = 300;

@Component({
  templateUrl: 'followers-page.html'
})
export class FollowersPage {
  @ViewChild('followersContent') homeContent;
  public loading: Boolean = true;
  public followers: any = [];
  private page: number = 1;
  public user: string;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,


    private filehttp: FileService
  ) { }

  ionViewWillEnter() {
    this.user = this.params.get('user');
    if (!this.user || this.user === this.filehttp.user) {
      this.user = 'user';
    } else {
      this.user = 'users/' + this.user;
    }
    this.refreshFollowers();
  }

  refreshFollowers() {
    this.loading = true;
    this.page = 1;
    this.getFollowers(true)
    .then(() => {
      this.loading = false;
    });
  }

  getFollowers(shouldRefresh: Boolean = false) {
    return this.filehttp.getFileFromUrl('/' + this.user + '/followers' + '?page=' + this.page + '&per_page=' + PER_PAGE)
    .then(response => {
      let res = response.json();
      if (shouldRefresh) {
        this.followers = [];
      }
      res.forEach((notification) => {
        this.followers.push(notification);
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
      this.getFollowers()
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
    this.nav.push(UserPage, {username: user.login});
  }
}

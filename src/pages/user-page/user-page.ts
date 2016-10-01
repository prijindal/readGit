import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {OctokatService} from '../../providers/octokat';
import {BrowserService} from '../../providers/browser';

import { ReposPage } from '../repos-page/repos-page';
import { StarredPage } from '../starred-page/starred-page';
import { FollowersPage } from '../followers-page/followers-page';
import { MembersPage } from '../members-page/members-page';
import { GistsPage } from '../gists-page/gists-page';
import { FollowingPage } from '../following-page/following-page';
import { WatchedPage } from '../watched-page/watched-page';

const PER_PAGE: number = 10000;

@Component({
  templateUrl: 'user-page.html'
})
export class UserPage {
  public loading: Boolean = true;
  public user: any;
  public starred: number;
  public watching: number;
  public members: number;
  public orgs: any;
  public followingLoaded: Boolean;
  public isFollowing: Boolean;
  public followingLoading: Boolean;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,

    private octokat: OctokatService,
    private browser: BrowserService
  ) { }

  ionViewWillEnter() {
    let user = this.params.get('user');
    let username = this.params.get('username');
    if (user) {
      this.loading = false;
      this.user = user;
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
            this.octokat.handleError({status: 404, message: 'Not Found'});
          }
        });
        return ;
      }
    } else {
      this.loading = false;
      this.octokat.handleError({message: 'Problem with Authentication'});
      return ;
    }

    if (this.user.login === this.octokat.user) {
      this.user.url = '/user';
    }
    this.getUserInfo();
  }

  getUserInfo() {
    this.loading = true;
    this.octokat.octo.fromUrl(this.user.url)
    .read()
    .then(res => {
      this.loading = false;
      this.user = JSON.parse(res);
      this.ref.detectChanges();
      if (this.user.login === this.octokat.user) {
        this.user.url = '/user';
      }
      if (this.user.type === 'User') {
        this.getStarred();
        this.getSubscriptions();
        this.getOrganizations();
        this.checkFollow();
      } else {
        this.getMembers();
      }
    })
    .catch(err => {
      this.loading = false;
      this.octokat.handleError({message: 'Problem with Authentication'});
    });
  }

  getStarred() {
    this.octokat.octo.fromUrl(this.user.url + '/starred?per_page=' + PER_PAGE)
    .read()
    .then(res => {
      res = JSON.parse(res);
      this.starred = res.length;
    });
  }

  getSubscriptions() {
    this.octokat.octo.fromUrl(this.user.url + '/subscriptions?per_page=' + PER_PAGE)
    .read()
    .then(res => {
      res = JSON.parse(res);
      this.watching = res.length;
    });
  }

  getOrganizations() {
    this.octokat.octo.fromUrl(this.user.url + '/orgs?per_page=' + PER_PAGE)
    .read()
    .then(res => {
      res = JSON.parse(res);
      this.orgs = res;
    });
  }

  checkFollow() {
    if (this.octokat.user && this.user.login !== this.octokat.user) {
      this.octokat.octo.user.following(this.user.login)
      .read()
      .then(res => {
        this.followingLoaded = true;
        this.isFollowing = true;
      }).catch(err => {
        this.followingLoaded = true;
        this.isFollowing = false;
      });
    }
  }

  followUser() {
    this.followingLoading = true;
    if (this.octokat.user && this.user.login !== this.octokat.user) {
      this.octokat.octo.user.following(this.user.login)
      .add()
      .then(res => {
        this.isFollowing = true;
        this.followingLoading = false;
      });
    }
  }

  unFollowUser() {
    this.followingLoading = true;
    if (this.octokat.user && this.user.login !== this.octokat.user) {
      this.octokat.octo.user.following(this.user.login)
      .remove()
      .then(res => {
        this.isFollowing = false;
        this.followingLoading = false;
      });
    }
  }

  getMembers() {
    this.octokat.octo.fromUrl(this.user.url + '/members?per_page=' + PER_PAGE)
    .read()
    .then(res => {
      res = JSON.parse(res);
      this.members = res.length;
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

  openGistsPage() {
    this.nav.push(GistsPage, {user: this.user.login});
  }

  openFollowingPage() {
    this.nav.push(FollowingPage, {user: this.user.login});
  }

  openWatchingPage() {
    this.nav.push(WatchedPage, {user: this.user.login});
  }

  openMembersPage() {
    this.nav.push(MembersPage, {user: this.user.login});
  }

  openUser(user) {
    this.nav.push(UserPage, {user: user});
  }
}

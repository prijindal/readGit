import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {FileService} from '../../providers/filehttp';
import {GraphApiService} from '../../providers/graphapi';
import {BrowserService} from '../../providers/browser';

import { ReposPage } from '../repos-page/repos-page';
import { StarredPage } from '../starred-page/starred-page';
import { FollowersPage } from '../followers-page/followers-page';
import { MembersPage } from '../members-page/members-page';
import { GistsPage } from '../gists-page/gists-page';
import { FollowingPage } from '../following-page/following-page';
import { WatchedPage } from '../watched-page/watched-page';

const USER_QUERY = `
query {
  repositoryOwner(login:"{{username}}") {
    id
    login
    ...on User {
      name
      avatarURL(size: 50)
      location
      email
      websiteURL
      bio
      viewerCanFollow
      viewerIsFollowing
      followers {
        totalCount
      }
      following {
        totalCount
      }
      repositories {
        totalCount
      }
      starredRepositories {
        totalCount
      }
      watching {
        totalCount
      }
      organizations(first: 30) {
        edges {
          node {
            login
            avatarURL(size: 40)
          }
        }
      }
    }
    ...on Organization {
      name
      avatarURL(size: 50)
      repositories {
        totalCount
      }
      members {
        totalCount
      }
    }
  }
}
`

@Component({
  templateUrl: 'user-page.html'
})
export class UserPage {
  public loading: Boolean = true;
  public user: any;
  public username: string;
  public starred: number;
  public watching: number;
  public members: number;
  public orgs: any;
  public followingLoading: Boolean;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,

    private browser: BrowserService,
    private filehttp: FileService,
    private graphapi: GraphApiService
  ) { }

  ionViewWillEnter() {
    let username = this.params.get('username');
    if (username) {
      this.username = username;
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
            this.filehttp.handleError({status: 404, message: 'Not Found'});
          }
        });
        return ;
      }
    } else {
      this.loading = false;
      this.filehttp.handleError({message: 'Problem with Authentication'});
      return ;
    }
    this.getUserInfo();
  }

  getUserInfo() {
    this.loading = true;
    let query = USER_QUERY.replace('{{username}}', this.username)
    this.graphapi.request(query)
    .subscribe(res => {
      this.user = res.repositoryOwner
      this.loading = false;
    }, err => {
      this.loading = false;
      this.filehttp.handleError({message: 'Problem with Authentication'});
    });
  }

  followUser() {
    this.followingLoading = true;
    if (this.filehttp.user && this.user.login !== this.filehttp.user) {
      this.filehttp.putRequest('/user/following/' + this.user.login, {})
      .then(res => {
        this.user.viewerIsFollowing = true;
        this.followingLoading = false;
      });
    }
  }

  unFollowUser() {
    this.followingLoading = true;
    if (this.filehttp.user && this.user.login !== this.filehttp.user) {
      this.filehttp.deleteRequest('/user/following/' + this.user.login)
      .then(res => {
        this.user.viewerIsFollowing = false;
        this.followingLoading = false;
      });
    }
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
    this.nav.push(UserPage, {username: user.login});
  }
}

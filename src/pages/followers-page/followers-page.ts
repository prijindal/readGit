import {Component, ChangeDetectorRef, ViewChild} from '@angular/core';
import {NavParams} from 'ionic-angular';

import {GraphApiService} from '../../providers/graphapi';
import {FileService} from '../../providers/filehttp';

import {Observable} from 'rxjs';

const PER_PAGE: number = 30;

const FOLLOWERS_USERS_QUERY = `
{
  repositoryOwner(login: "{{username}}") {
    ...on User {
      followers(first: ${PER_PAGE}, after: "{{after}}") {
        edges {
          node {
            login
            avatarURL(size: 50)
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
}
`

@Component({
  templateUrl: 'followers-page.html'
})
export class FollowersPage {
  public loading: Boolean = true;
  public followers: any = [];
  private endCursor: string = "";
  public user: string;

  constructor(
    private ref: ChangeDetectorRef,
    private params: NavParams,

    private filehttp: FileService,
    private graphapi: GraphApiService
  ) { }

  ionViewWillEnter() {
    this.user = this.params.get('user');
    if (!this.user) {
      this.user = this.filehttp.user;
    } else {
      this.user = this.user;
    }
    this.refreshFollowers();
  }

  refreshFollowers() {
    this.loading = true;
    this.endCursor = "";
    this.getFollowers(true)
    .subscribe(() => {
      this.loading = false;
    }, err => {
      this.filehttp.handleError(err);
    });
  }

  getFollowers(shouldRefresh: Boolean = false) {
    let query = FOLLOWERS_USERS_QUERY.replace('{{username}}', this.user)
    if (!this.endCursor) {
      query = query.replace(', after: "{{after}}"', '')
    } else {
      query = query.replace('{{after}}', this.endCursor)
    }
    return this.graphapi.request(query)
    .map(res => res.repositoryOwner.followers)
    .map(res => {
      if (shouldRefresh) {
        this.followers = [];
      }
      res.edges.forEach((repo) => {
        this.followers.push(repo.node);
      });
      this.ref.detectChanges();
      this.endCursor = res.pageInfo.endCursor;
      return res;
    });
  }

  doInfinite(infiniteScroll) {
    this.getFollowers()
    .subscribe(res => {
      infiniteScroll.complete();
      if (!res.pageInfo.hasNextPage) {
        infiniteScroll.enable(false);
      }
    }, err => {
      this.filehttp.handleError(err);
    })
  }
}

import {Component, ChangeDetectorRef} from '@angular/core';
import {NavParams} from 'ionic-angular';

import {GraphApiService} from '../../providers/graphapi';
import {FileService} from '../../providers/filehttp';

import {Observable} from 'rxjs';


@Component({
  templateUrl: 'base-users-page.html'
})
export class BaseUsersPage {
  public loading: Boolean = true;
  public users: any = [];
  private endCursor: string = "";
  public user: string;
  public users_query: string = ``;
  public title: string = '';

  constructor(
    public ref: ChangeDetectorRef,
    public params: NavParams,

    public filehttp: FileService,
    public graphapi: GraphApiService 
  ) { }

  ionViewWillEnter() {
    this.user = this.params.get('user');
    if (!this.user) {
      this.user = this.filehttp.user;
    } else {
      this.user = this.user;
    }
    this.refreshUsers();
  }

  refreshUsers() {
    this.loading = true;
    this.endCursor = "";
    this.getUsers(true)
    .subscribe(() => {
      this.loading = false;
    }, err => {
      this.filehttp.handleError(err);
    });
  }

  getUsers(shouldRefresh: Boolean = false) {
    let query = this.users_query.replace('{{username}}', this.user)
    if (!this.endCursor) {
      query = query.replace(', after: "{{after}}"', '')
    } else {
      query = query.replace('{{after}}', this.endCursor)
    }
    return this.graphapi.request(query)
    .map(res => res.repositoryOwner.members)
    .map(res => {
      if (shouldRefresh) {
        this.users = [];
      }
      res.edges.forEach((user) => {
        this.users.push(user.node);
      });
      this.ref.detectChanges();
      this.endCursor = res.pageInfo.endCursor;
      return res;
    });
  }

  doInfinite(infiniteScroll) {
    this.getUsers()
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

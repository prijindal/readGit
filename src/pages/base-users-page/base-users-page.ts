import {Component, ChangeDetectorRef} from '@angular/core';
import {NavParams} from 'ionic-angular';

import {GraphApiService} from '../../providers/graphapi';
import {FileService} from '../../providers/filehttp';

import {Observable} from 'rxjs';

const PER_PAGE: number = 30;

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
  public key: string;

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

  getUsers(shouldRefresh: Boolean = false): Observable<any> {
    let variables = {username: this.user, PER_PAGE: PER_PAGE};
    if (this.endCursor) {
      variables['after'] = this.endCursor;
    }
    return this.graphapi.request(this.users_query, variables)
    .map(res => res.repositoryOwner[this.key])
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

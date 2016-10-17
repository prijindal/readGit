import {Component, ChangeDetectorRef} from '@angular/core';
import {NavParams} from 'ionic-angular';

import {GraphApiService} from '../../providers/graphapi';
import {FileService} from '../../providers/filehttp';

import {Observable} from 'rxjs';

const PER_PAGE: number = 30;

@Component({
  templateUrl: 'base-repos-page.html'
})
export class BaseReposPage {
  public loading: Boolean = true;
  public repos: any = [];
  private endCursor: string = "";
  public user: string;
  public repos_query: string = ``;
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
    this.refreshRepos();
  }

  refreshRepos() {
    this.loading = true;
    this.endCursor = "";
    this.getRepos(true)
    .subscribe(() => {
      this.loading = false;
    }, err => {
      this.filehttp.handleError(err);
    });
  }

  getRepos(shouldRefresh: Boolean = false): Observable<any> {
    let variables = {username: this.user, PER_PAGE: PER_PAGE};
    if (this.endCursor) {
      variables['after'] = this.endCursor;
    }
    return this.graphapi.request(this.repos_query, variables)
    .map(res => res.repositoryOwner[this.key])
    .map(res => {
      if (shouldRefresh) {
        this.repos = [];
      }
      res.edges.forEach((repo) => {
        this.repos.push(repo.node);
      });
      this.ref.detectChanges();
      this.endCursor = res.pageInfo.endCursor;
      return res;
    });
  }

  doInfinite(infiniteScroll) {
    this.getRepos()
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

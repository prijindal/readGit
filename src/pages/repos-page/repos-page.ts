import {Component, ChangeDetectorRef, ViewChild} from '@angular/core';
import {NavParams} from 'ionic-angular';

import {GraphApiService} from '../../providers/graphapi';
import {FileService} from '../../providers/filehttp';

import {Observable} from 'rxjs';

const PER_PAGE: number = 30;

const REPOS_QUERY = `
{
  repositoryOwner(login: "{{username}}") {
    repositories(first: ${PER_PAGE}, after: "{{after}}", orderBy: {field: NAME, direction: ASC}) {
      edges {
        node {
          isFork
          isPrivate
          name
          owner {
            login
          }
          descriptionHTML
          stargazers {
            totalCount
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
}
`

@Component({
  templateUrl: 'repos-page.html'
})
export class ReposPage {
  public loading: Boolean = true;
  public repos: any = [];
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
    let query = REPOS_QUERY.replace('{{username}}', this.user)
    if (!this.endCursor) {
      query = query.replace('after: "{{after}}",', '')
    } else {
      query = query.replace('{{after}}', this.endCursor)
    }
    return this.graphapi.request(query)
    .map(res => res.repositoryOwner.repositories)
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

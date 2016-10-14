import {Component, ChangeDetectorRef, ViewChild} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {GraphApiService} from '../../providers/graphapi';
import {FileService} from '../../providers/filehttp';

import { RepoPage } from '../repo-page/repo-page';

import {Observable} from 'rxjs';

const PER_PAGE: number = 30;

const REPOS_QUERY = `
{
  repositoryOwner(login: "{{username}}") {
    repositories(first: 30, after: "{{after}}", orderBy: {field: NAME, direction: ASC}) {
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
  @ViewChild('reposContent') homeContent;
  public loading: Boolean = true;
  public repos: any = [];
  private endCursor: string = "";
  public user: string;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
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
    this.getRepos(true)
    .subscribe(() => {
      this.loading = false;
    }, err => {
      this.filehttp.handleError(err);
    });
  }

  getRepos(shouldRefresh: Boolean = false): Observable<any> {
    let query = REPOS_QUERY.replace('{{username}}', this.user)
    query = query.replace('{{after}}', this.endCursor)
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
      console.dir(res);
      infiniteScroll.complete();
      if (!res.pageInfo.hasNextPage) {
        infiniteScroll.enable(false);
      }
    }, err => {
      this.filehttp.handleError(err);
    })
  }

  openRepository(repo) {
    this.nav.push(RepoPage, {reponame: repo.owner.login + '/' + repo.name});
  }
}

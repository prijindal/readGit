import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {Observable} from 'rxjs';
import moment from 'moment';

import {FileService} from '../../providers/filehttp';
import {GraphApiService} from '../../providers/graphapi';
import {BrowserService} from '../../providers/browser';

import { CommitPage } from '../commit-page/commit-page';

const PER_PAGE: number = 60;

const COMMIT_QUERY = `
query($username: String!, $reponame:String!, $PER_PAGE:Int, $after:String) {
  repository(owner: $username, name: $reponame) {
    ref(qualifiedName: "master") {
      target {
				...CommitHistory
      }
    }
  }
}

fragment CommitHistory on Commit {
  history(first: $PER_PAGE, after: $after) {
    edges {
      node {
        oid
        messageHeadline
        author {
          user {
            avatarURL(size: 50)
            login
          }
          name
          date
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
`

@Component({
  templateUrl: 'commits-page.html'
})
export class CommitsPage {
  public loading: Boolean = true;
  public commits: any = [];
  public username: string;
  public reponame: string;
  private endCursor: string = "";

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,

    private filehttp: FileService,
    private graphapi: GraphApiService,
    private browser: BrowserService
  ) { }

  ionViewWillEnter() {
    this.username = this.params.get('username');
    this.reponame = this.params.get('reponame');
    this.refreshCommits();
  }

  refreshCommits() {
    this.loading = true;
    this.endCursor = "";
    this.getCommits(true)
    .subscribe(() => {
      this.loading = false;
    }, err => {
      this.filehttp.handleError(err);
    });
  }

  getCommits(shouldRefresh: Boolean = false): Observable<any> {
    let variables = {
      username: this.username,
      reponame: this.reponame,
      PER_PAGE: PER_PAGE
    }
    if (this.endCursor) {
      variables['after'] = this.endCursor
    }
    return this.graphapi.request(COMMIT_QUERY, variables)
    .map(res => res.repository.ref.target.history)
    .map(res => {
      if (shouldRefresh) {
        this.commits = [];
      }
      res.edges.forEach((commit) => {
        this.commits.push(commit.node);
      });
      this.ref.detectChanges();
      this.endCursor = res.pageInfo.endCursor;
      return res;
    })
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }

  doInfinite(infiniteScroll) {
    this.getCommits()
    .subscribe(res => {
      infiniteScroll.complete();
      if (!res.pageInfo.hasNextPage) {
        infiniteScroll.enable(false);
      }
    }, err => {
      this.filehttp.handleError(err);
    })
  }

  openCommit(commit) {
    this.nav.push(CommitPage, {username: this.username, reponame: this.reponame, sha: commit.oid});
  }
}

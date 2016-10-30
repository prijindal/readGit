import {Component, ChangeDetectorRef} from '@angular/core';
import {NavParams} from 'ionic-angular';

import {GraphApiService} from '../../providers/graphapi';
import {FileService} from '../../providers/filehttp';

import {BaseReposPage} from '../base-repos-page/base-repos-page'

const WATCHING_REPOS_QUERY = `
query($username: String!, $PER_PAGE: Int, $after: String) {
  repositoryOwner(login: $username) {
    ...on User {
      watching(first: $PER_PAGE, after: $after) {
        edges {
          node {
            ...RepoInfo
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
  templateUrl: '../base-repos-page/base-repos-page.html'
})
export class WatchedPage extends BaseReposPage {
  public repos_query: string = WATCHING_REPOS_QUERY;
  public title: string = 'Repos Watched by ';
  public key: string = 'watching';

  constructor(
    public ref: ChangeDetectorRef,
    public params: NavParams,

    public filehttp: FileService,
    public graphapi: GraphApiService
  ) {
    super(ref, params, filehttp, graphapi)
  }
}

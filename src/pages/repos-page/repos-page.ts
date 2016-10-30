import {Component, ChangeDetectorRef} from '@angular/core';
import {NavParams} from 'ionic-angular';

import {GraphApiService} from '../../providers/graphapi';
import {FileService} from '../../providers/filehttp';

import {BaseReposPage} from '../base-repos-page/base-repos-page'


const REPOS_QUERY = `
query($username: String!, $PER_PAGE: Int, $after: String) {
  repositoryOwner(login: $username) {
    repositories(first: $PER_PAGE, after: $after, orderBy: {field: NAME, direction: ASC}) {
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
`

@Component({
  templateUrl: '../base-repos-page/base-repos-page.html'
})
export class ReposPage extends BaseReposPage {
  public repos_query: string = REPOS_QUERY;
  public title: string = 'Repos of ';
  public key: string = 'repositories';

  constructor(
    public ref: ChangeDetectorRef,
    public params: NavParams,

    public filehttp: FileService,
    public graphapi: GraphApiService
  ) {
    super(ref, params, filehttp, graphapi)
  }
}

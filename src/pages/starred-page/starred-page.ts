import {Component, ChangeDetectorRef} from '@angular/core';
import {NavParams} from 'ionic-angular';

import {GraphApiService} from '../../providers/graphapi';
import {FileService} from '../../providers/filehttp';

import {BaseReposPage} from '../base-repos-page/base-repos-page'

const STARRED_REPOS_QUERY = `
query($username: String!, $PER_PAGE: Int, $after: String) {
  repositoryOwner(login: $username) {
    ...on User {
      starredRepositories(first: $PER_PAGE, after: $after, orderBy: {field: STARRED_AT, direction: DESC}) {
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
}
`

@Component({
  templateUrl: '../base-repos-page/base-repos-page.html'
})
export class StarredPage extends BaseReposPage {
  public repos_query: string = STARRED_REPOS_QUERY;
  public title: string = 'Starred Repos of ';
  public key: string = 'starredRepositories';

  constructor(
    public ref: ChangeDetectorRef,
    public params: NavParams,

    public filehttp: FileService,
    public graphapi: GraphApiService
  ) {
    super(ref, params, filehttp, graphapi)
  }
}

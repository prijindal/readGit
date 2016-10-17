import {Component, ChangeDetectorRef} from '@angular/core';
import {NavParams} from 'ionic-angular';

import {GraphApiService} from '../../providers/graphapi';
import {FileService} from '../../providers/filehttp';

import {BaseUsersPage} from '../base-users-page/base-users-page';

const FOLLOWERS_USERS_QUERY = `
query($username: String!, $PER_PAGE: Int, $after: String) {
  repositoryOwner(login: $username) {
    ...on User {
      followers(first: $PER_PAGE, after: $after) {
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
  templateUrl: '../base-users-page/base-users-page.html'
})
export class FollowersPage extends BaseUsersPage {
  public users_query: string = FOLLOWERS_USERS_QUERY;
  public title: string = 'Followers of';
  public key: string = 'followers';

  constructor(
    public ref: ChangeDetectorRef,
    public params: NavParams,

    public filehttp: FileService,
    public graphapi: GraphApiService
  ) {
    super(ref, params, filehttp, graphapi);
  }
}

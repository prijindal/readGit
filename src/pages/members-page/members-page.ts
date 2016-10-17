import {Component, ChangeDetectorRef} from '@angular/core';
import {NavParams} from 'ionic-angular';

import {GraphApiService} from '../../providers/graphapi';
import {FileService} from '../../providers/filehttp';

import {BaseUsersPage} from '../base-users-page/base-users-page';

const MEMBERS_USERS_QUERY = `
query($username: String!, $PER_PAGE: Int, $after: String) {
  repositoryOwner(login: $username) {
    ...on Organization {
      members(first: $PER_PAGE, after: $after) {
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
export class MembersPage extends BaseUsersPage {
  public users_query: string = MEMBERS_USERS_QUERY;
  public title: string = 'Members of';
  public key: string = 'members';

  constructor(
    public ref: ChangeDetectorRef,
    public params: NavParams,

    public filehttp: FileService,
    public graphapi: GraphApiService
  ) {
    super(ref, params, filehttp, graphapi);
  }
}

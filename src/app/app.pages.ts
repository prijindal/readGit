import {DeepLinkConfig} from 'ionic-angular';

import {BaseUsersPage} from '../pages/base-users-page/base-users-page';
import {BaseReposPage} from '../pages/base-repos-page/base-repos-page';

import {BlobPage} from '../pages/blob-page/blob-page';
import {BlogPage} from '../pages/blog-page/blog-page';

import {BlogsPage} from '../pages/blogs-page/blogs-page';
import {BlogsPopover} from '../pages/blogs-page/blogs-popover/blogs-popover';

import {BranchesPage} from '../pages/branches-page/branches-page';
import {CommitPage} from '../pages/commit-page/commit-page';
import {CommitsPage} from '../pages/commits-page/commits-page';
import {ComparePage} from '../pages/compare-page/compare-page';
import {FollowersPage} from '../pages/followers-page/followers-page';
import {FollowingPage} from '../pages/following-page/following-page';
import {GistNewPage} from '../pages/gist-new-page/gist-new-page';
import {GistPage} from '../pages/gist-page/gist-page';
import {GistsPage} from '../pages/gists-page/gists-page';
import {HomePage} from '../pages/home-page/home-page';

import {IssuePage} from '../pages/issue-page/issue-page';
import {IssuePopover} from '../pages/issue-page/issue-popover/issue-popover';

import {IssuesPage} from '../pages/issues-page/issues-page';
import {IssuesPopover} from '../pages/issues-page/issues-popover/issues-popover';

import {JobPage} from '../pages/job-page/job-page';
import {JobsPage} from '../pages/jobs-page/jobs-page';

import {MilestonesPage} from '../pages/milestones-page/milestones-page';
import {MilestonesPopover} from '../pages/milestones-page/milestones-popover/milestones-popover';

import {MembersPage} from '../pages/members-page/members-page';
import {NetworkPage} from '../pages/network-page/network-page';

import {NotificationsPage} from '../pages/notifications-page/notifications-page';
import {NotificationsPopover} from '../pages/notifications-page/notifications-popover/notifications-popover';

import {ProjectsPage} from '../pages/projects-page/projects-page';
import {ReleasesPage} from '../pages/releases-page/releases-page';

import {RepoPage} from '../pages/repo-page/repo-page';
import {RepoPopover} from '../pages/repo-page/repo-popover/repo-popover';

import {ReposPage} from '../pages/repos-page/repos-page';
import {StarredPage} from '../pages/starred-page/starred-page';
import {SearchPage} from '../pages/search-page/search-page';
import {TagPage} from '../pages/tag-page/tag-page';
import {TreePage} from '../pages/tree-page/tree-page';
import {UserPage} from '../pages/user-page/user-page';
import {WatchedPage} from '../pages/watched-page/watched-page';

export const APP_PAGES = [
  BaseUsersPage,
  BaseReposPage,

  BlobPage,
  BlogPage,

  BlogsPage,
  BlogsPopover,

  BranchesPage,
  CommitPage,
  CommitsPage,
  ComparePage,
  FollowersPage,
  FollowingPage,
  GistNewPage,
  GistPage,
  GistsPage,
  HomePage,

  IssuePage,
  IssuePopover,

  IssuesPage,
  IssuesPopover,

  JobPage,
  JobsPage,

  MilestonesPage,
  MilestonesPopover,

  MembersPage,
  NetworkPage,

  NotificationsPage,
  NotificationsPopover,

  ProjectsPage,
  ReleasesPage,

  RepoPage,
  RepoPopover,

  ReposPage,
  StarredPage,
  SearchPage,
  TagPage,
  TreePage,
  UserPage,
  WatchedPage
]

export const deepLinkConfig: DeepLinkConfig = {
    links: [
      {
        component: HomePage,
        name: 'Home',
        segment: ''
      },
      {
        component: UserPage,
        name: 'User Page',
        segment: ':username'
      },
      {
        component: RepoPage,
        name: 'Repo Page',
        segment: ':username/:reponame'
      },
      {
        component: CommitsPage,
        name: 'Commits Page',
        segment: ':username/:reponame/commits'
      },
      {
        component: CommitPage,
        name: 'Commit Page',
        segment: ':username/:reponame/commits/:sha'
      },
      {
        component: IssuesPage,
        name: 'Issues Page',
        segment: ':username/:reponame/issues'
      },
      {
        component: IssuePage,
        name: 'Issue Page',
        segment: ':username/:reponame/issues/:issuenumber'
      },
      {
        component: ReleasesPage,
        name: 'Releases Page',
        segment: ':username/:reponame/releases'
      },
      {
        component: MilestonesPage,
        name: 'Milestones Page',
        segment: ':username/:reponame/milestones'
      },
      {
        component: ProjectsPage,
        name: 'Projects Page',
        segment: ':username/:reponame/projects'
      },
      {
        component: NetworkPage,
        name: 'Network Page',
        segment: ':username/:reponame/network'
      },
    ]
}

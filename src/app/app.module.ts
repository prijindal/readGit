import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import {JsonpModule} from '@angular/http';
import { MyApp } from './app.component';

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
import {IssuesPage} from '../pages/issues-page/issues-page';
import {JobPage} from '../pages/job-page/job-page';
import {JobsPage} from '../pages/jobs-page/jobs-page';
import {MembersPage} from '../pages/members-page/members-page';
import {NetworkPage} from '../pages/network-page/network-page';
import {NotificationsPage} from '../pages/notifications-page/notifications-page';
import {ReleasesPage} from '../pages/releases-page/releases-page';

import {RepoPage} from '../pages/repo-page/repo-page';
import {RepoPopover} from '../pages/repo-page/repo-popover/repo-popover';

import {ReposPage} from '../pages/repos-page/repos-page';
import {StarredPage} from '../pages/starred-page/starred-page';
import {SearchPage} from '../pages/search-page/search-page';
import {TreePage} from '../pages/tree-page/tree-page';
import {UserPage} from '../pages/user-page/user-page';
import {WatchedPage} from '../pages/watched-page/watched-page';


import { ProfileInfo } from './profile-info/profile-info';

import {GithubLogin} from '../providers/githublogin';
import {ErrorService} from '../providers/error';
import {LocalService} from '../providers/local';
import {OctokatService} from '../providers/octokat';
import {EventParser} from '../providers/eventparser';
import {FaviconService} from '../providers/favicon';
import {BrowserService} from '../providers/browser';
import {FileService} from '../providers/filehttp';
import {UrlParser} from '../providers/urlparser';

@NgModule({
  declarations: [
    MyApp,
    ProfileInfo,

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
    IssuesPage,
    JobPage,
    JobsPage,
    MembersPage,
    NetworkPage,
    NotificationsPage,
    ReleasesPage,

    RepoPage,
    RepoPopover,

    ReposPage,
    StarredPage,
    SearchPage,
    TreePage,
    UserPage,
    WatchedPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    JsonpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,

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
    IssuesPage,
    JobPage,
    JobsPage,
    MembersPage,
    NetworkPage,
    NotificationsPage,
    ReleasesPage,

    RepoPage,
    RepoPopover,

    ReposPage,
    StarredPage,
    SearchPage,
    TreePage,
    UserPage,
    WatchedPage
  ],
  providers: [
    LocalService,
    ErrorService,
    OctokatService,
    GithubLogin,
    FaviconService,
    EventParser,
    BrowserService,
    FileService,
    UrlParser
  ]
})
export class AppModule {}

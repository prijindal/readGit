import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

import {HomePage} from '../pages/home-page/home-page';
import {ErrorPage} from '../pages/error-page/error-page';

import {SearchPage} from '../pages/search-page/search-page';
import {NotificationsPage} from '../pages/notifications-page/notifications-page';
import {ReposPage} from '../pages/repos-page/repos-page';
import {GistsPage} from '../pages/gists-page/gists-page';
import {StarredPage} from '../pages/starred-page/starred-page';
import {FollowersPage} from '../pages/followers-page/followers-page';
import {FollowingPage} from '../pages/following-page/following-page';
import {WatchedPage} from '../pages/watched-page/watched-page';
import {UserPage} from '../pages/user-page/user-page';
import {RepoPage} from '../pages/repo-page/repo-page';
import {IssuesPage} from '../pages/issues-page/issues-page';
import {IssuePage} from '../pages/issue-page/issue-page';
import {CommitsPage} from '../pages/commits-page/commits-page';
import {CommitPage} from '../pages/commit-page/commit-page';
import {ComparePage} from '../pages/compare-page/compare-page';
import {BlogsPage} from '../pages/blogs-page/blogs-page';

import { ProfileInfo } from './profile-info/profile-info';

import GithubLogin from '../services/githublogin';
import LocalService from '../services/local';
import OctokatService from '../services/octokat';
import EventParser from '../services/eventparser';
import FaviconService from '../services/favicon';
import BrowserService from '../services/browser';
import FileService from '../services/filehttp';
import UrlParser from '../services/urlparser';

@NgModule({
  declarations: [
    MyApp,
    ProfileInfo,
    HomePage,
    ErrorPage,
    SearchPage,
    NotificationsPage,
    ReposPage,
    GistsPage,
    StarredPage,
    FollowersPage,
    FollowingPage,
    WatchedPage,
    UserPage,
    RepoPage,
    IssuesPage,
    IssuePage,
    CommitsPage,
    CommitPage,
    ComparePage,
    BlogsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ErrorPage,
    SearchPage,
    NotificationsPage,
    ReposPage,
    GistsPage,
    StarredPage,
    FollowersPage,
    FollowingPage,
    WatchedPage,
    UserPage,
    RepoPage,
    IssuesPage,
    IssuePage,
    CommitsPage,
    CommitPage,
    ComparePage,
    BlogsPage
  ],
  providers: [
    LocalService,
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

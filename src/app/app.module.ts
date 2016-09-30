import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

import {BlogPage} from '../pages/blog-page/blog-page';
import {BlogsPage} from '../pages/blogs-page/blogs-page';
import {CommitPage} from '../pages/commit-page/commit-page';
import {CommitsPage} from '../pages/commits-page/commits-page';
import {ComparePage} from '../pages/compare-page/compare-page';
import {ErrorPage} from '../pages/error-page/error-page';
import {FollowersPage} from '../pages/followers-page/followers-page';
import {FollowingPage} from '../pages/following-page/following-page';
import {GistPage} from '../pages/gist-page/gist-page';
import {GistsPage} from '../pages/gists-page/gists-page';
import {HomePage} from '../pages/home-page/home-page';
import {IssuePage} from '../pages/issue-page/issue-page';
import {IssuesPage} from '../pages/issues-page/issues-page';
import {MembersPage} from '../pages/members-page/members-page';
import {NotificationsPage} from '../pages/notifications-page/notifications-page';
import {RepoPage} from '../pages/repo-page/repo-page';
import {ReposPage} from '../pages/repos-page/repos-page';
import {StarredPage} from '../pages/starred-page/starred-page';
import {SearchPage} from '../pages/search-page/search-page';
import {UserPage} from '../pages/user-page/user-page';
import {WatchedPage} from '../pages/watched-page/watched-page';

import { ProfileInfo } from './profile-info/profile-info';

import {GithubLogin} from '../services/githublogin';
import {LocalService} from '../services/local';
import {OctokatService} from '../services/octokat';
import {EventParser} from '../services/eventparser';
import {FaviconService} from '../services/favicon';
import {BrowserService} from '../services/browser';
import {FileService} from '../services/filehttp';
import {UrlParser} from '../services/urlparser';

@NgModule({
  declarations: [
    MyApp,
    ProfileInfo,

    BlogPage,
    BlogsPage,
    CommitPage,
    CommitsPage,
    ComparePage,
    ErrorPage,
    FollowersPage,
    FollowingPage,
    GistPage,
    GistsPage,
    HomePage,
    IssuePage,
    IssuesPage,
    MembersPage,
    NotificationsPage,
    RepoPage,
    ReposPage,
    StarredPage,
    SearchPage,
    UserPage,
    WatchedPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    
    BlogPage,
    BlogsPage,
    CommitPage,
    CommitsPage,
    ComparePage,
    ErrorPage,
    FollowersPage,
    FollowingPage,
    GistPage,
    GistsPage,
    HomePage,
    IssuePage,
    IssuesPage,
    MembersPage,
    NotificationsPage,
    RepoPage,
    ReposPage,
    StarredPage,
    SearchPage,
    UserPage,
    WatchedPage
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

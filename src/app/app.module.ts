import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

import {BlogPage} from '../pages/blog-page/blog-page';
import {BlogsPage} from '../pages/blogs-page/blogs-page';
import {CommitPage} from '../pages/commit-page/commit-page';
import {CommitsPage} from '../pages/commits-page/commits-page';
import {ComparePage} from '../pages/compare-page/compare-page';
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

    BlogPage,
    BlogsPage,
    CommitPage,
    CommitsPage,
    ComparePage,
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

import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import {JsonpModule} from '@angular/http';
import { MyApp } from './app.component';

import { ProfileInfo } from './profile-info/profile-info';

import {RepoInfo} from '../components/repo-info/repo-info';
import {UserInfo} from '../components/user-info/user-info';
import {CommentCard} from '../components/comment-card/comment-card';
import {CommentReactions} from '../components/comment-reactions/comment-reactions';
import {IssueCard} from '../components/issue-card/issue-card';

import {APP_PROVIDERS} from './app.providers';
import {APP_PAGES, deepLinkConfig} from './app.pages';

@NgModule({
  declarations: [
    MyApp,
    ProfileInfo,
    APP_PAGES,
    RepoInfo,
    UserInfo,
    CommentCard,
    CommentReactions,
    IssueCard
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      pageTransitionDelay: 0,
      popoverEnter: "popover-pop-in",
      popoverLeave: "popover-pop-out"
    }, deepLinkConfig),
    JsonpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    APP_PAGES
  ],
  providers: [
    APP_PROVIDERS
  ]
})
export class AppModule {}

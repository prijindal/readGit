import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import {JsonpModule} from '@angular/http';
import { MyApp } from './app.component';

import { ProfileInfo } from './profile-info/profile-info';

import {RepoInfo} from '../components/repo-info/repo-info';
import {UserInfo} from '../components/user-info/user-info';

import {APP_PROVIDERS} from './app.providers';
import {APP_PAGES} from './app.pages';

@NgModule({
  declarations: [
    MyApp,
    ProfileInfo,
    APP_PAGES,
    RepoInfo,
    UserInfo
  ],
  imports: [
    IonicModule.forRoot(MyApp),
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

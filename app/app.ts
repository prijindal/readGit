import 'es6-shim';
import 'rxjs/Rx';
import {Component, ViewChild} from '@angular/core';
import {App, ionicBootstrap, Platform, MenuController, Nav, Events} from 'ionic-angular';
import {StatusBar, Deeplinks} from 'ionic-native';

import {LoginPage} from './pages/login-page/login-page';

import {HomePage} from './pages/home-page/home-page';
import {NotificationsPage} from './pages/notifications-page/notifications-page';
import {ReposPage} from './pages/repos-page/repos-page';
import {StarredPage} from './pages/starred-page/starred-page';
import {WatchedPage} from './pages/watched-page/watched-page';

import { ProfileInfo } from './profile-info/profile-info';

import GithubLogin from './services/githublogin';
import LocalService from './services/local';
import OctokatService from './services/octokat';
import EventParser from './services/eventparser';
import BrowserService from './services/browser';
import FileService from './services/filehttp';

@Component({
  templateUrl: 'build/app.html',
  directives: [ProfileInfo]
})
class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = LoginPage;
  menuEnabled: Boolean = false;
  pages: Array<{title: string, component: any}>;

  constructor(
    private app: App,
    private menu: MenuController,
    private platform: Platform,
    private events: Events
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'News Feed', component: HomePage},
      {title: 'Notifications', component: NotificationsPage},
      {title: 'Repositories', component: ReposPage},
      {title: 'Stars', component: StarredPage},
      {title: 'Watching', component: WatchedPage}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      this.registerBackButtonListener();
      this.eventsInit();

      if (window['nativeclick']) {
        window['nativeclick'].watch(['sound-click', 'button']);
      }
    });
  }

  openPage(page) {
    let nav = this.app.getActiveNav();
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.component === HomePage) {
      nav.popToRoot();
    } else {
      nav.push(page.component);
    }
    if (window['nativeclick']) {
      window['nativeclick'].trigger();
    }
  }

  private eventsInit() {
    this.events.subscribe('login', () => {
      this.menuEnabled = true;
    });
  }

  private registerBackButtonListener() {
    this.platform.registerBackButtonAction(() => {
      if (this.menu.isOpen()) {
        this.menu.close();
      } else {
        if (this.nav.canGoBack()) {
          this.nav.pop();
        } else {
          navigator['app'].exitApp();
        }
      }
    });
  }
}

ionicBootstrap(MyApp, [
  LocalService,
  OctokatService,
  GithubLogin,
  EventParser,
  BrowserService,
  FileService
], {

});

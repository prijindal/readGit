import 'es6-shim';
import 'rxjs/Rx';
import {Component, ViewChild} from '@angular/core';
import {App, ionicBootstrap, Platform, MenuController, Nav, Events} from 'ionic-angular';
import {StatusBar} from 'ionic-native';

import {LoginPage} from './pages/login-page/login-page';

import GithubLogin from './services/githublogin';
import LocalService from './services/local';
import OctokatService from './services/octokat';

@Component({
  templateUrl: 'build/app.html'
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

    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      this.registerBackButtonListener();
      this.eventsInit();
    });
  }

  openPage(page) {
    let nav = this.app.getActiveNav();
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    nav.setRoot(page.component);
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
          this.confirmExitApp();
        }
      }
    });
  }

  private confirmExitApp() {
    let homeIntent = navigator['home'];
    if (homeIntent) {
      homeIntent.home();
    } else if (navigator['app']) {
      navigator['app'].exitApp();
    }
    return true;
  }
}

ionicBootstrap(MyApp, [
  LocalService,
  OctokatService,
  GithubLogin
]);

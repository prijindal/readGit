import 'es6-shim';
import 'rxjs/Rx';
import {Component} from '@angular/core';
import {App, ionicBootstrap, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';

import {LoginPage} from './pages/login-page/login-page';

import GithubLogin from './services/githublogin';
import LocalService from './services/local';
import OctokatService from './services/octokat';

@Component({
  templateUrl: 'build/app.html'
})
class MyApp {
  rootPage: any = LoginPage;
  pages: Array<{title: string, component: any}>;

  constructor(
    private app: App,
    private githubLogin: GithubLogin,
    private platform: Platform
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
      // this.checkNetwork()
    });
  }

  openPage(page) {
    let nav = this.app.getActiveNav();
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    nav.setRoot(page.component);
  }
}

ionicBootstrap(MyApp, [
  LocalService,
  OctokatService,
  GithubLogin
]);

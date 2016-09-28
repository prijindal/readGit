import {Component, ViewChild} from '@angular/core';
import {App, Platform, MenuController, Nav, Events} from 'ionic-angular';
import {StatusBar, Deeplinks} from 'ionic-native';

import {SearchPage} from '../pages/search-page/search-page';
import {HomePage} from '../pages/home-page/home-page';
import {NotificationsPage} from '../pages/notifications-page/notifications-page';
import {ReposPage} from '../pages/repos-page/repos-page';
import {GistsPage} from '../pages/gists-page/gists-page';
import {StarredPage} from '../pages/starred-page/starred-page';
import {FollowersPage} from '../pages/followers-page/followers-page';
import {FollowingPage} from '../pages/following-page/following-page';
import {WatchedPage} from '../pages/watched-page/watched-page';

import {BlogsPage} from '../pages/blogs-page/blogs-page';

import {OctokatService} from '../services/octokat';
import {UrlParser} from '../services/urlparser';

@Component({
  templateUrl: 'app.component.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = HomePage;
  menuEnabled: Boolean = false;
  profileEnabled: Boolean = false;
  pages: Array<{title: string, component: any}>;

  constructor(
    private app: App,
    private menu: MenuController,
    private platform: Platform,
    private events: Events,
    private octokat: OctokatService,
    private urlparser: UrlParser
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      this.registerBackButtonListener();
      this.eventsInit();
      // this.verifyLogin();
      this.deeplinkInit();
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

  private deeplinkInit() {
    Deeplinks.route({
      '/:1': 1,
      '/:1/:2': 1,
      '/:1/:2/:3': 1,
      '/:1/:2/:3/:4': 1,
      '/:1/:2/:3/:4/:5': 1
    })
    .subscribe((match) => {
      setTimeout(() => {
        this.urlparser.openUrl(this.nav, match.$link.url);
      }, 800);
    }, (nomatch) => {
      console.dir(nomatch);
      console.error('Got a deeplink that didn\'t match');
    });
  }

  private eventsInit() {
    this.events.subscribe('login', (isLoggedIn) => {
      this.menuEnabled = true;
      if (isLoggedIn[0]) {
        this.profileEnabled = true;
        this.pages = [
          {title: 'News Feed', component: HomePage},
          {title: 'Notifications', component: NotificationsPage},
          {title: 'Repositories', component: ReposPage},
          {title: 'Stars', component: StarredPage},
          {title: 'Watching', component: WatchedPage},
          {title: 'Followers', component: FollowersPage},
          {title: 'Following', component: FollowingPage},
          {title: 'Gists', component: GistsPage},
          {title: 'Search', component: SearchPage},
          {title: 'Github Blog', component: BlogsPage}
        ];
      } else {
        this.profileEnabled = false;
        this.pages = [
          {title: 'Search', component: SearchPage},
          {title: 'Github Blog', component: BlogsPage}
        ];
      }
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

import {Component, ViewChild, ChangeDetectorRef} from '@angular/core';
import {App, Platform, MenuController, Nav, Events} from 'ionic-angular';
import {StatusBar, Deeplinks, Splashscreen} from 'ionic-native';

import {deepLinkConfig} from './app.pages';

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
import {JobsPage} from '../pages/jobs-page/jobs-page';

import {FileService} from '../providers/filehttp';
import {GraphApiService} from '../providers/graphapi';
import {UrlParser} from '../providers/urlparser';
import {OcticonService} from '../providers/octicon';
import {NotificationsService} from '../providers/notifications';

const DEFAULT_PAGES = [
  {title: 'Search', component: SearchPage, icon:'search', type: 'ionicon'},
  {title: 'Github Blog', component: BlogsPage, icon:'rss', type: 'octicon'},
  {title: 'Github Jobs', component: JobsPage, icon:'code-working', type: 'ionicon'}
];

@Component({
  templateUrl: 'app.component.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = HomePage;
  profileEnabled: Boolean = false;
  pages: Array<{title: string, component: any, icon: string, type: string}> = DEFAULT_PAGES;

  constructor(
    private ref: ChangeDetectorRef,
    private app: App,
    private menu: MenuController,
    private platform: Platform,
    private events: Events,
    private filehttp: FileService,
    private graphapi: GraphApiService,
    private urlparser: UrlParser,
    private octicon: OcticonService,
    private notificationsService: NotificationsService
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
      this.graphapi.verifyLogin();
      console.dir(this.app);
      Splashscreen.hide();
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
    let routes = {};
    deepLinkConfig.links.forEach((link) => {
      routes['/' + link.segment] = link.component
    })
    Deeplinks.route(routes)
    .subscribe((match) => {
      console.dir(match)
      this.nav.push(match.$route, match.$args);
    }, (nomatch) => {
      console.dir(nomatch);
      console.error('Got a deeplink that didn\'t match');
    });
  }

  private eventsInit() {
    this.events.subscribe('login', (isLoggedIn) => {
      if (isLoggedIn[0]) {
        this.profileEnabled = true;
        this.pages = [
          {title: 'News Feed', component: HomePage, icon:'home', type: 'ionicon'},
          {title: 'Notifications', component: NotificationsPage, icon:'notifications', type: 'ionicon'},
          {title: 'Repositories', component: ReposPage, icon:'repo', type: 'octicon'},
          {title: 'Stars', component: StarredPage, icon:'star', type: 'ionicon'},
          {title: 'Watching', component: WatchedPage, icon:'eye', type: 'ionicon'},
          {title: 'Followers', component: FollowersPage, icon:'person', type: 'ionicon'},
          {title: 'Following', component: FollowingPage, icon:'person-add', type: 'ionicon'},
          {title: 'Gists', component: GistsPage, icon:'gist', type: 'octicon'},
          {title: 'Search', component: SearchPage, icon:'search', type: 'ionicon'},
          {title: 'Github Blog', component: BlogsPage, icon:'rss', type: 'octicon'},
          {title: 'Github Jobs', component: JobsPage, icon:'code-working', type: 'ionicon'}
        ];
        this.notificationsService.setUpNotifications();
      } else {
        this.profileEnabled = false;
        this.pages = DEFAULT_PAGES;
      }
      this.ref.detectChanges();
    });
    this.filehttp.checkLogin()
    .catch(err => {
      this.events.publish('login', false);
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

import {Component, ChangeDetectorRef, ViewChild} from '@angular/core';
import {NavController, Events} from 'ionic-angular';


import {FileService} from '../../providers/filehttp';
import {GraphApiService} from '../../providers/graphapi';
import {EventParser} from '../../providers/eventparser';
import {UrlParser} from '../../providers/urlparser';
import {BrowserService} from '../../providers/browser';
import {GithubLogin} from '../../providers/githublogin';
import {FaviconService} from '../../providers/favicon';

import { RepoPage } from '../repo-page/repo-page';
import { UserPage } from '../user-page/user-page';
import { SearchPage } from '../search-page/search-page';

const PER_PAGE: number = 10;
const LIMIT: number = 300;

@Component({
  templateUrl: 'home-page.html'
})
export class HomePage {
  @ViewChild('homeContent') homeContent;
  public loggedIn: Boolean = false;
  public loading: Boolean = true;
  public waiting: Boolean = false;
  public acceptcode: Boolean = false;
  public received_events: any = [];
  public message: string;
  public username: string;
  public password: string;
  public twofactor: string;
  public errorMessage: string;
  private page: number = 1;
  private received_eventsUrl: string;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private events: Events,

    private filehttp: FileService,
    private graphapi: GraphApiService,
    private eventParser: EventParser,
    private browser: BrowserService,
    private githubLogin: GithubLogin,
    private favicon: FaviconService,
    private urlparser: UrlParser
  ) { }

  ionViewWillEnter() {
    this.message = 'Waiting';
    if (this.filehttp.userData) {
      console.log('Already Logged In')
      // If logged in, then refreshEvents
      this.received_eventsUrl = '/users/' + this.filehttp.userData.login + '/received_events'
      if (this.received_events.length === 0) {
        this.refreshEvents();
      }
      this.favicon.set(this.filehttp.userData.avatarURL);
    } else {
      this.message = 'Verifying You...';
      this.events.subscribe('login', (isLoggedIn) => {    
        if (isLoggedIn[0]) {
          this.message = 'Logged In';
          this.loggedIn = true;
          this.received_eventsUrl = '/users/' + this.filehttp.userData.login + '/received_events'
          if (this.received_events.length === 0) {
            this.refreshEvents();
          }
          this.favicon.set(this.filehttp.userData.avatarURL);
        } else {
          this.loading = false;
          this.message = '';
          this.ref.detectChanges();
          // Show Login Screen
        }
      })
    }
  }

  focusInput() {
    if (!this.loading) {
      let usernamInput = document.querySelector('ion-input[name="username"] input');
      usernamInput['focus']();
      this.ref.detectChanges();
    }
  }

  focusTwoFactorInput() {
    if (this.acceptcode) {
      let twofactorInput = document.querySelector('ion-input[name="twofactor"] input');
      twofactorInput['focus']();
      this.ref.detectChanges();
    }
  }

  login() {
    this.waiting = true;
    this.errorMessage = '';
    this.githubLogin.login(this.username, this.password, this.twofactor)
    .subscribe((res) => {
      this.waiting = false;
      this.message = 'Successfully Authenticated';
      this.filehttp.setToken(res.token)
      .then(() => {
        this.graphapi.verifyLogin();
      });
    }, (err) => {
      this.waiting = false;
      let errParsed = err.json();
      if (err.headers.get('X-GitHub-OTP') && err.headers.get('X-GitHub-OTP').search('required') === 0) {
        this.acceptcode = true;
        setTimeout(() => {
          this.focusTwoFactorInput();
        }, 100);
      } else if (errParsed.message) {
        this.errorMessage = errParsed.message;
      } else {
        this.filehttp.handleError(err);
      }
    });
  }

  checkEnter(event) {
    if (event.key === 'Enter') {
      this.login();
    }
  }

  refreshEvents() {
    this.loading = true;
    this.page = 1;
    return this.getEvents(true)
    .then(() => {
      this.loading = false;
    });
  }

  doRefresh(refresher) {
    this.refreshEvents()
    .then(() => {
      refresher.complete();
    })
  }

  getEvents(shouldRefresh: Boolean = false) {
    return this.filehttp.getFileFromUrl(this.received_eventsUrl + '?page=' + this.page + '&per_page=' + PER_PAGE)
    .then(response => {
      let res = response.json()
      if (shouldRefresh) {
        this.received_events = [];
      }
      res.forEach((event) => {
        this.received_events.push(this.eventParser.parseEvent(event));
      });
      this.ref.detectChanges();
      return res;
    })
    .catch(err => {
      this.filehttp.handleError(err);
    });
  }

  doInfinite(infiniteScroll) {
    this.page += 1;
    if (this.page <= LIMIT / PER_PAGE) {
      this.getEvents()
      .then((res) => {
        infiniteScroll.complete();
        if (res.length < PER_PAGE) {
          infiniteScroll.enable(false);
        }
      });
    } else {
      infiniteScroll.enable(false);
    }
  }

  openEvent(event) {
    this.urlparser.openUrl(this.nav, event.html_url);
  }

  openUser(user) {
    this.nav.push(UserPage, {username: user.login});
  }

  openRepo(repo) {
    let splited = repo.name.split('/')
    this.nav.push(RepoPage, {username: splited[0], reponame: splited[1]})
  }

  openSearchPage() {
    this.nav.push(SearchPage);
  }
}

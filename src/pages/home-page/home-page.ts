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

const VIEWER_QUERY = `
{
	viewer {
    id
    login
    name
    email
    avatarURL
  }
}
`

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
    this.verifyLogin();
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
        this.verifyLogin();
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

  verifyLogin() {
    this.loading = true;
    return this.filehttp.checkLogin()
    .then(res => {
      this.message = 'Verifying You...';
      this.graphapi.request(VIEWER_QUERY)
      .map(res => res.viewer)
      .subscribe(res => {
        this.filehttp.userData = res;
        this.filehttp.user = res.login;
        this.message = 'Logged In';
        this.events.publish('login', true);
        this.loggedIn = true;
        let user = res;
        if (user) {
          this.received_eventsUrl = '/users/' + res.login + '/received_events'
          if (this.received_events.length === 0) {
            this.refreshEvents();
          }
          this.favicon.set(user.avatarURL.split('?')[0] + '?s=50');
        } else {
          this.filehttp.handleError({message: 'Problem with Authentication'});
        }
      }, err => {
        this.loading = false;
        this.errorMessage = 'Some Error Occured';
        this.filehttp.handleError(err);
      });
    })
    .catch(res => {
      this.events.publish('login', false);
      this.loading = false;
      this.message = '';
      this.ref.detectChanges();
      setTimeout(() => {
        this.focusInput();
      }, 100);
    });
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
    this.nav.push(RepoPage, {reponame: repo.name});
  }

  openSearchPage() {
    this.nav.push(SearchPage);
  }
}

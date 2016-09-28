import {Component, ChangeDetectorRef, ViewChild} from '@angular/core';
import {NavController, PopoverController, Events} from 'ionic-angular';

import OctokatService from '../../services/octokat';
import EventParser from '../../services/eventparser';
import UrlParser from '../../services/urlparser';
import BrowserService from '../../services/browser';
import GithubLogin from '../../services/githublogin';
import FaviconService from '../../services/favicon';

import { ErrorPage } from '../error-page/error-page';
import { RepoPage } from '../repo-page/repo-page';
import { UserPage } from '../user-page/user-page';
import { SearchPage } from '../search-page/search-page';

import { Popover } from './popover/popover';

const PER_PAGE: number = 10;
const LIMIT: number = 300;

@Component({
  templateUrl: 'home-page.html'
})
export class HomePage {
  @ViewChild('homeContent') homeContent;
  public loggedIn: Boolean = false;
  private loading: Boolean = true;
  private waiting: Boolean = false;
  private acceptcode: Boolean = false;
  public received_events: any = [];
  private message: string;
  private username: string;
  private password: string;
  private twofactor: string;
  private errorMessage: string;
  private page: number = 1;
  private received_eventsUrl: string;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private events: Events,
    private popoverCtrl: PopoverController,
    private octokat: OctokatService,
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
    .subscribe(() => {
      this.waiting = false;
      this.message = 'Successfully Authenticated';
      this.verifyLogin();
    }, (err) => {
      this.waiting = false;
      let errParsed = err.json();
      if (err.headers.get('X-GitHub-OTP') && err.headers.get('X-GitHub-OTP').search('required') === 0) {
        this.acceptcode = true;
        setTimeout(() => {
          this.focusTwoFactorInput();
        }, 100);
      } else if (errParsed.message) {
        console.log(errParsed);
        this.errorMessage = errParsed.message;
      } else {
        this.nav.push(ErrorPage, {error: err});
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
    return this.octokat.checkLogin()
    .then(res => {
      this.message = 'Verifying You...';
      this.octokat.octo.me.read()
      .then(res => {
        res = JSON.parse(res);
        this.octokat.userData = res;
        this.octokat.user = res.login;
        this.message = 'Logged In';
        this.events.publish('login', true);
        this.loggedIn = true;
        let user = res;
        if (user) {
          this.received_eventsUrl = user.received_events_url.replace('{/privacy}', '');
          if (this.received_events.length === 0) {
            this.refreshEvents();
          }
          this.favicon.set('https://avatars.githubusercontent.com/u/' + user.id + '?s=50');
        } else {
          this.nav.push(ErrorPage, {error: {message: 'Problem with Authentication'}});
        }
      })
      .catch(err => {
        this.nav.push(ErrorPage, {error: err});
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
    this.getEvents(true)
    .then(() => {
      this.loading = false;
    });
  }

  getEvents(shouldRefresh: Boolean = false) {
    return this.octokat.octo.fromUrl(this.received_eventsUrl + '?page=' + this.page + '&per_page=' + PER_PAGE).read()
    .then(res => {
      res = JSON.parse(res);
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
      this.nav.push(ErrorPage, {error: err});
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
    this.nav.push(UserPage, {user: user});
  }

  openRepo(repo) {
    this.nav.push(RepoPage, {repo: repo});
  }

  openSearchPage() {
    this.nav.push(SearchPage);
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(Popover);
    popover.present({
      ev: event
    });
  }
}

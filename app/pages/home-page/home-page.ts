import {Component, ChangeDetectorRef, ViewChild} from '@angular/core';
import {NavController, NavParams, PopoverController} from 'ionic-angular';

import OctokatService from '../../services/octokat';
import EventParser from '../../services/eventparser';
import BrowserService from '../../services/browser';

import { ErrorPage } from '../error-page/error-page';
import { RepoPage } from '../repo-page/repo-page';
import { UserPage } from '../user-page/user-page';
import { SearchPage } from '../search-page/search-page';

import { Popover } from './popover/popover';

const PER_PAGE: number = 10;
const LIMIT: number = 300;

@Component({
  templateUrl: 'build/pages/home-page/home-page.html'
})
export class HomePage {
  @ViewChild('homeContent') homeContent;
  public loading: Boolean = true;
  public events: any = [];
  private page: number = 1;
  private eventsUrl: string;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,
    private popoverCtrl: PopoverController,
    private octokat: OctokatService,
    private eventParser: EventParser,
    private browser: BrowserService
  ) { }

  ionViewWillEnter() {
    let user = this.params.get('user');
    if (user) {
      this.eventsUrl = user.received_events_url.replace('{/privacy}', '');
      if (this.events.length === 0) {
        this.refreshEvents();
      }
    } else {
      this.nav.push(ErrorPage, {error: {message: 'Problem with Authentication'}});
    }
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
    return this.octokat.octo.fromUrl(this.eventsUrl + '?page=' + this.page + '&per_page=' + PER_PAGE).read()
    .then(res => {
      res = JSON.parse(res);
      if (shouldRefresh) {
        this.homeContent.scrollTo(0, 0);
        this.events = [];
      }
      res.forEach((event) => {
        this.events.push(this.eventParser.parseEvent(event));
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
      .then(() => {
        infiniteScroll.complete();
      });
    } else {
      infiniteScroll.enable(false);
    }
  }

  openEvent(event) {
    this.browser.open(event.html_url);
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

import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, NavParams, PopoverController} from 'ionic-angular';

import OctokatService from '../../services/octokat';
import EventParser from '../../services/eventparser';

import { ErrorPage } from '../error-page/error-page';

import { Popover } from './popover/popover';

@Component({
  templateUrl: 'build/pages/home-page/home-page.html'
})
export class HomePage {
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
    private eventParser: EventParser
  ) { }

  ionViewWillEnter() {
    let user = this.params.get('user');
    if (user) {
      this.eventsUrl = user.received_events_url.replace('{/privacy}', '');
      if (this.events.length === 0) {
        this.getEvents();
      }
    } else {
      this.nav.push(ErrorPage, {error: {message: 'Problem with Authentication'}});
    }
  }

  getEvents() {
    this.loading = true;
    return this.octokat.octo.fromUrl(this.eventsUrl + '?page=' + this.page).read()
    .then(res => {
      this.loading = false;
      res = JSON.parse(res);
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
    this.getEvents()
    .then(() => {
      infiniteScroll.complete();
    });
  }

  openEvent(event) {
    window.open(event.html_url, '_system');
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(Popover);
    popover.present({
      ev: event
    });
  }
}

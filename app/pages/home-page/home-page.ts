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
    this.octokat.octo.fromUrl(this.eventsUrl).read()
    .then(res => {
      this.loading = false;
      res = JSON.parse(res);
      let events = [];
      res.forEach((event) => {
        events.push(this.eventParser.parseEvent(event));
      });
      this.events = events;
      this.ref.detectChanges();
    })
    .catch(err => {
      this.nav.push(ErrorPage, {error: err});
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

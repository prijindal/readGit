import {Component, ChangeDetectorRef, ViewChild} from '@angular/core';
import {NavController, NavParams, PopoverController} from 'ionic-angular';

import OctokatService from '../../services/octokat';

import { ErrorPage } from '../error-page/error-page';
import { RepoPage } from '../repo-page/repo-page';

import { Popover } from './popover/popover';

const PER_PAGE: number = 10000;

@Component({
  templateUrl: 'build/pages/watched-page/watched-page.html'
})
export class WatchedPage {
  @ViewChild('subscriptionsContent') homeContent;
  public loading: Boolean = true;
  public subscriptions: any = [];
  private user: string;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,
    private popoverCtrl: PopoverController,
    private octokat: OctokatService
  ) { }

  ionViewWillEnter() {
    this.user = this.params.get('user');
    if (!this.user || this.user === this.octokat.user) {
      this.user = 'user';
    } else {
      this.user = 'users/' + this.user;
    }
    this.getWatched();
  }

  getWatched() {
    return this.octokat.octo.fromUrl('/' + this.user + '/subscriptions' + '?per_page=' + PER_PAGE).read()
    .then(res => {
      this.subscriptions = JSON.parse(res);
      this.ref.detectChanges();
      return res;
    })
    .catch(err => {
      this.nav.push(ErrorPage, {error: err});
    });
  }

  openRepository(repo) {
    this.nav.push(RepoPage, {repo: repo});
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(Popover);
    popover.present({
      ev: event
    });
  }
}

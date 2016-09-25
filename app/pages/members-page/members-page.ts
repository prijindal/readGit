import {Component, ChangeDetectorRef, ViewChild} from '@angular/core';
import {NavController, NavParams, PopoverController} from 'ionic-angular';

import OctokatService from '../../services/octokat';

import { ErrorPage } from '../error-page/error-page';
import { UserPage } from '../user-page/user-page';

import { Popover } from './popover/popover';

const PER_PAGE: number = 30;
const LIMIT: number = 300;

@Component({
  templateUrl: 'build/pages/members-page/members-page.html'
})
export class MembersPage {
  @ViewChild('membersContent') homeContent;
  public loading: Boolean = true;
  public members: any = [];
  private page: number = 1;
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
    this.user = 'orgs/' + this.user;
    this.refreshEvents();
  }

  refreshEvents() {
    this.loading = true;
    this.page = 1;
    this.getMembers(true)
    .then(() => {
      this.loading = false;
    });
  }

  getMembers(shouldRefresh: Boolean = false) {
    return this.octokat.octo.fromUrl('/' + this.user + '/members' + '?page=' + this.page + '&per_page=' + PER_PAGE).read()
    .then(res => {
      res = JSON.parse(res);
      if (shouldRefresh) {
        this.homeContent.scrollTo(0, 0);
        this.members = [];
      }
      res.forEach((notification) => {
        this.members.push(notification);
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
      this.getMembers()
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

  openUser(user) {
    this.nav.push(UserPage, {user: user});
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(Popover);
    popover.present({
      ev: event
    });
  }
}

import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import OctokatService from '../../services/octokat';

import { ErrorPage } from '../error-page/error-page';

@Component({
  templateUrl: 'build/pages/home-page/home-page.html'
})
export class HomePage {
  public user: any;

  constructor(
    private nav: NavController,
    private params: NavParams,
    private octokat: OctokatService
  ) { }

  ionViewWillEnter() {
    let user = this.params.get('user');
    if (user) {
      this.user = user;
    }
    this.getUser();
  }

  getUser() {
    this.octokat.octo.me.fetch()
    .then(res => {
      this.user = res;
    })
    .catch(err => {
      this.nav.push(ErrorPage, {error: err});
    });
  }
}

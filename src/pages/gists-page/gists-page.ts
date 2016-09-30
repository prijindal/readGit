import {Component, ChangeDetectorRef, ViewChild} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {OctokatService} from '../../providers/octokat';

import { ErrorPage } from '../error-page/error-page';
import { GistPage } from '../gist-page/gist-page';



const PER_PAGE: number = 30;

@Component({
  templateUrl: 'gists-page.html'
})
export class GistsPage {
  @ViewChild('gistsContent') homeContent;
  public loading: Boolean = true;
  public gists: any = [];
  private page: number = 1;
  public user: string;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,

    private octokat: OctokatService
  ) { }

  ionViewWillEnter() {
    this.user = this.params.get('user');
    if (!this.user || this.user === this.octokat.user) {
      this.user = '';
    } else {
      this.user = '/users/' + this.user;
    }
    this.refreshGists();
  }

  refreshGists() {
    this.loading = true;
    this.page = 1;
    this.getGists(true)
    .then(() => {
      this.loading = false;
    });
  }

  getGists(shouldRefresh: Boolean = false) {
    return this.octokat.octo.fromUrl(this.user + '/gists' + '?sort=updated&page=' + this.page + '&per_page=' + PER_PAGE).read()
    .then(res => {
      res = JSON.parse(res);
      if (shouldRefresh) {
        this.gists = [];
      }
      res.forEach((gist) => {
        this.gists.push(gist);
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
    this.getGists()
    .then((res) => {
      infiniteScroll.complete();
      if (res.length < PER_PAGE) {
        infiniteScroll.enable(false);
      }
    });
  }

  openGist(gist) {
    this.nav.push(GistPage, {gist: gist});
  }
}

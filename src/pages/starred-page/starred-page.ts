import {Component, ChangeDetectorRef, ViewChild} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {OctokatService} from '../../services/octokat';

import { ErrorPage } from '../error-page/error-page';
import { RepoPage } from '../repo-page/repo-page';



const PER_PAGE: number = 10000;

@Component({
  templateUrl: 'starred-page.html'
})
export class StarredPage {
  @ViewChild('starredContent') homeContent;
  public loading: Boolean = true;
  public starred: any = [];
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
      this.user = 'user';
    } else {
      this.user = 'users/' + this.user;
    }
    this.getStarred();
  }

  getStarred() {
    return this.octokat.octo.fromUrl('/' + this.user + '/starred' + '?per_page=' + PER_PAGE).read()
    .then(res => {
      res = JSON.parse(res);
      this.starred = res;
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
}
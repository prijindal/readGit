import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, NavParams, PopoverController} from 'ionic-angular';

import OctokatService from '../../services/octokat';

import { ErrorPage } from '../error-page/error-page';

import { Popover } from './popover/popover';

@Component({
  templateUrl: 'build/pages/repo-page/repo-page.html'
})
export class RepoPage {
  public loading: Boolean = true;
  private repo: any;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,
    private popoverCtrl: PopoverController,
    private octokat: OctokatService
  ) { }

  ionViewWillEnter() {
    let repo = this.params.get('repo');
    if (repo) {
      this.loading = false;
      this.repo = repo;
      this.getRepoInfo();
    } else {
      // Replace With Better Error Handling
      // Use Case: Fetching Repo using just the link
      this.loading = false;
      this.nav.push(ErrorPage, {error: {message: 'Problem with Fetching Repository'}});
    }
  }

  getRepoInfo() {
    this.loading = true;
    this.octokat.octo.fromUrl(this.repo.url)
    .fetch()
    .then(res => {
      this.loading = false;
      this.repo = res;
    })
    .catch(err => {
      this.loading = false;
      this.nav.push(ErrorPage, {error: {message: 'Problem with Fetching Repository'}});
    });
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(Popover);
    popover.present({
      ev: event
    });
  }
}

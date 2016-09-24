import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, NavParams, PopoverController} from 'ionic-angular';

import OctokatService from '../../services/octokat';
import FileService from '../../services/filehttp';
import BrowserService from '../../services/browser';

import { ErrorPage } from '../error-page/error-page';
import { UserPage } from '../user-page/user-page';

import { Popover } from './popover/popover';

@Component({
  templateUrl: 'build/pages/repo-page/repo-page.html'
})
export class RepoPage {
  public loading: Boolean = true;
  private repo: any;
  private readme: string;
  private readmeError: any;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,
    private popoverCtrl: PopoverController,
    private octokat: OctokatService,
    private filehttp: FileService,
    private browser: BrowserService
  ) { }

  ionViewWillEnter() {
    let repo = this.params.get('repo');
    let username = this.params.get('username');
    let reponame = this.params.get('reponame');
    if (repo) {
      this.loading = false;
      this.repo = repo;
      this.getRepoInfo();
    } else if (username && reponame) {
      this.repo = { full_name: username + '/' + reponame};
      this.repo['url'] = '/repos/' + this.repo['full_name'];
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
    .read()
    .then(res => {
      this.loading = false;
      this.repo = JSON.parse(res);
      this.getReadMe();
    })
    .catch(err => {
      this.loading = false;
      this.nav.push(ErrorPage, {error: {message: 'Problem with Fetching Repository'}});
    });
  }

  getReadMe() {
    this.filehttp.getFileFromUrl(this.repo.url + '/readme', 'html')
    .then(res => {
      let text = res.text();
      this.readme = text;
      this.ref.detectChanges();
    })
    .catch(err => {
      this.readmeError = true;
      this.ref.detectChanges();
    });
  }

  openUser(owner) {
    this.nav.push(UserPage, {user: owner});
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(Popover);
    popover.present({
      ev: event
    });
  }
}

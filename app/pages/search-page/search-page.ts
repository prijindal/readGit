import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, NavParams, PopoverController} from 'ionic-angular';

import OctokatService from '../../services/octokat';
import BrowserService from '../../services/browser';

import { RepoPage } from '../repo-page/repo-page';
import { UserPage } from '../user-page/user-page';

const SEARCH_URL = '/search';

@Component({
  templateUrl: 'build/pages/search-page/search-page.html'
})
export class SearchPage {
  public searchterm: string = '';
  private repos: any;
  private users: any;
  private issues: any;
  private codes: any;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,
    private popoverCtrl: PopoverController,
    private octokat: OctokatService,
    private browser: BrowserService
  ) { }

  cancelSearch() {
    this.nav.pop();
  }

  getItems() {
    this.searchterm = this.searchterm.trim();
    if (!this.searchterm) {
      this.clearItems();
      return ;
    };
    this.octokat.octo.fromUrl(SEARCH_URL + '/repositories?q=' + this.searchterm + '&per_page=3')
    .read()
    .then(res => {
      this.repos = JSON.parse(res);
    });
    this.octokat.octo.fromUrl(SEARCH_URL + '/users?q=' + this.searchterm + '&per_page=3')
    .read()
    .then(res => {
      this.users = JSON.parse(res);
    });
    this.octokat.octo.fromUrl(SEARCH_URL + '/issues?q=' + this.searchterm + '&per_page=3')
    .read()
    .then(res => {
      this.issues = JSON.parse(res);
    });
    this.octokat.octo.fromUrl(SEARCH_URL + '/code?q=' + this.searchterm + '&per_page=3')
    .read()
    .then(res => {
      this.codes = JSON.parse(res);
    });
  }

  clearItems() {
    this.repos = null;
    this.users = null;
    this.issues = null;
    this.codes = null;
  }

  openRepository(repo) {
    this.nav.push(RepoPage, {repo: repo});
  }

  openUser(user) {
    this.nav.push(UserPage, {user: user});
  }

  openIssue(issue) {
    this.browser.open(issue.htmlUrl);
  }


  openCode(code) {
    this.browser.open(code.htmlUrl);
  }
}

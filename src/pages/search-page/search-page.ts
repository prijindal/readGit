import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {FileService} from '../../providers/filehttp';
import {BrowserService} from '../../providers/browser';

import { RepoPage } from '../repo-page/repo-page';
import { UserPage } from '../user-page/user-page';
import { IssuePage } from '../issue-page/issue-page';

const SEARCH_URL = '/search';

@Component({
  templateUrl: 'search-page.html'
})
export class SearchPage {
  public searchterm: string = '';
  public repos: any;
  public users: any;
  public issues: any;
  public codes: any;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,

    private filehttp: FileService,
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
    this.filehttp.getFileFromUrl(SEARCH_URL + '/repositories?q=' + this.searchterm + '&per_page=3')
    .then(res => {
      this.repos = res.json();
    });
    this.filehttp.getFileFromUrl(SEARCH_URL + '/users?q=' + this.searchterm + '&per_page=3')
    .then(res => {
      this.users = res.json();
    });
    this.filehttp.getFileFromUrl(SEARCH_URL + '/issues?q=' + this.searchterm + '&per_page=3')
    .then(res => {
      this.issues = res.json();
    });
    this.filehttp.getFileFromUrl(SEARCH_URL + '/code?q=' + this.searchterm + '&per_page=3')
    .then(res => {
      this.codes = res.json();
    });
  }

  clearItems() {
    this.repos = null;
    this.users = null;
    this.issues = null;
    this.codes = null;
  }

  openRepository(repo) {
    let splited = repo.full_name.split('/')
    this.nav.push(RepoPage, {username: splited[0], reponame: splited[1]})
  }

  openUser(user) {
    this.nav.push(UserPage, {username: user.login});
  }

  openIssue(issue) {
    this.nav.push(IssuePage, {issue: issue});
  }


  openCode(code) {
    this.browser.open(code.html_url);
  }
}

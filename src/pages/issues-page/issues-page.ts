import {Component, ChangeDetectorRef, ViewChild} from '@angular/core';
import {NavController, NavParams, PopoverController} from 'ionic-angular';

import moment from 'moment';

import {IssuesPopover} from './issues-popover/issues-popover';

import {FileService} from '../../providers/filehttp';
import {BrowserService} from '../../providers/browser';
import {OcticonService} from '../../providers/octicon';
import {AutohideService} from '../../providers/autohide';

import { IssuePage } from '../issue-page/issue-page';

const PER_PAGE: number = 30;

@Component({
  selector: 'issues-page',
  templateUrl: 'issues-page.html'
})
export class IssuesPage {
  @ViewChild('issuesContent') issuesContent;
  public searchbarhidden: Boolean = false;
  public loading: Boolean = true;
  public issues: any = [];
  public icons: {};
  private page: number = 1;
  public repo: string;
  public query: string = 'is:issue is:open';

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,
    private popoverCtrl: PopoverController,

    private octicon: OcticonService,
    private filehttp: FileService,
    private browser: BrowserService,
    private autohide: AutohideService
  ) { }

  ionViewWillEnter() {
    let username = this.params.get('username');
    let reponame = this.params.get('reponame');
    this.repo = username + '/' + reponame;
    let query = this.params.get('query');
    if (query) {
      this.query = query;
    }
    if (this.issues.length === 0) {
      this.refreshIssues();
    }
  }

  ionViewDidEnter() {
    this.autohide.init(this.issuesContent, (value) => {
      this.searchbarhidden = value;
    });
  }

  ionViewWillLeave() {
    this.autohide.destroy(this.issuesContent);
  }

  refreshIssues() {
    this.loading = true;
    this.page = 1;
    this.issues = [];
    this.getIssues(true)
    .then(() => {
      this.loading = false;
    });
  }

  getIssues(shouldRefresh: Boolean = false) {
    let url = '/search/issues' + '?page=' + this.page + '&per_page=' + PER_PAGE
    url+='&q=repo:' + this.repo + '+' + this.query.replace(' ','+')
    return this.filehttp.getFileFromUrl(url)
    .then(response => {
      let res = response.json();
      if (shouldRefresh) {
        this.issues = [];
      }
      res.items.forEach((issue) => {
        let icon = 'issue-opened';
        let iconclass = 'green'
        if (issue.pull_request) {
          icon = 'git-pull-request';
          iconclass = issue.state === 'open' ? 'green' : ''
        } else {
          icon = issue.state === 'open' ? 'issue-opened' : 'issue-closed'
          iconclass = issue.state === 'open' ? 'green' : 'red'
        }
        issue.class = 'octicon ' + iconclass;
        issue.icon = this.octicon.get(icon);
        this.issues.push(issue);
      });
      this.ref.detectChanges();
      return res.items;
    })
    .catch(err => {
      this.filehttp.handleError(err);
    });
  }

  doInfinite(infiniteScroll) {
    this.page += 1;
    this.getIssues()
    .then((res) => {
      infiniteScroll.complete();
      if (res.length < PER_PAGE) {
        infiniteScroll.enable(false);
      }
    });
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }

  openIssue(issue) {
    let splitted = this.repo.split('/')
    this.nav.push(IssuePage, {username: splitted[0], reponame: splitted[1], issuenumber: issue.number});
  }


  presentPopover(event) {
    let popover = this.popoverCtrl.create(IssuesPopover, {query: this.query})
    popover.present({ev: event});

    popover.onDidDismiss((query) => {
      if (query) {
        this.query = query;
        this.refreshIssues();
      }
    });
  }
}

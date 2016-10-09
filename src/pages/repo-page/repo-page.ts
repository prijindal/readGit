import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, NavParams, PopoverController} from 'ionic-angular';


import {FileService} from '../../providers/filehttp';
import {BrowserService} from '../../providers/browser';

import { TreePage } from '../tree-page/tree-page';
import { BranchesPage } from '../branches-page/branches-page';
import { NetworkPage } from '../network-page/network-page';
import { UserPage } from '../user-page/user-page';
import { IssuesPage } from '../issues-page/issues-page';
import { CommitsPage } from '../commits-page/commits-page';

import {RepoPopover} from './repo-popover/repo-popover';

@Component({
  templateUrl: 'repo-page.html'
})
export class RepoPage {
  public loading: Boolean = true;
  public repo: any;
  public readme: string;
  public readmeError: any;
  public branches: number;
  public pulls: number;
  public commits: number;
  public subscription: any;
  public isSubscribed: any;
  public starring: any;
  public isStarring: any;
  public watchingLoading: Boolean = false;
  public starringLoading: Boolean = false;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,
    private popoverCtrl: PopoverController,

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
      this.repo['url'] = 'https://api.github.com/repos/' + this.repo['full_name'];
      this.getRepoInfo();
    } else {
      // Replace With Better Error Handling
      // Use Case: Fetching Repo using just the link
      this.loading = false;
      this.filehttp.handleError({message: 'Problem with Fetching Repository'});
    }
  }

  getRepoInfo() {
    this.loading = true;
    this.filehttp.getFileFromUrl(this.repo.url)
    .then(res => {
      this.loading = false;
      this.repo = res.json();
      this.getReadMe();
      this.getBranches();
      this.getPulls();
      this.getCommits();
      this.checkWatching();
      this.checkStarring();
    })
    .catch(err => {
      this.loading = false;
      if (err.status === 404) {
        this.filehttp.handleError(err);
      } else {
        this.filehttp.handleError({message: 'Problem with Fetching Repository'});
      }
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

  getBranches() {
    this.filehttp.getHeaders(this.repo.url + '/branches?page=1&per_page=1')
    .then(res => {
      this.branches = this.filehttp.getLinkLength(res);
    });
  }

  getPulls() {
    this.filehttp.getHeaders(this.repo.url + '/pulls?page=1&per_page=1')
    .then(res => {
      this.pulls = this.filehttp.getLinkLength(res);
    });
  }

  getCommits() {
    this.filehttp.getHeaders(this.repo.url + '/commits?page=1&per_page=1')
    .then(res => {
      this.commits = this.filehttp.getLinkLength(res);
    });
  }

  checkWatching() {
    if (this.filehttp.user) {
      this.filehttp.getFileFromUrl(this.repo.url + '/subscription')
      .then(res => {
        this.subscription = true;
        this.isSubscribed = true;
      })
      .catch(err => {
        if (err.status === 404) {
          this.isSubscribed = false;
          this.subscription = true;
        }
      });
    }
  }

  watchRepo(repo) {
    this.watchingLoading = true;
    this.filehttp.putRequest(this.repo.url + '/subscription', {subscribed: true})
    .then(res => {
      this.isSubscribed = true;
      this.watchingLoading = false;
    });
  }

  unWatchRepo(repo) {
    this.watchingLoading = true;
    this.filehttp.deleteRequest(this.repo.url + '/subscription')
    .then(res => {
      this.isSubscribed = false;
      this.watchingLoading = false;
    });
  }

  checkStarring() {
    if (this.filehttp.user) {
      this.filehttp.getFileFromUrl('/user/starred/' + this.repo.full_name)
      .then(res => {
        this.starring = true;
        this.isStarring = true;
      })
      .catch(err => {
        if (err.status === 404) {
          this.isStarring = false;
          this.starring = true;
        }
      });
    }
  }

  starRepo(repo) {
    this.starringLoading = true;
    this.filehttp.putRequest('/user/starred/' + this.repo.full_name, {})
    .then(res => {
      this.isStarring = true;
      this.starringLoading = false;
    });
  }

  unStarRepo(repo) {
    this.starringLoading = true;
    this.filehttp.deleteRequest('/user/starred/' + this.repo.full_name)
    .then(res => {
      this.isStarring = false;
      this.starringLoading = false;
    });
  }

  openUser(owner) {
    this.nav.push(UserPage, {user: owner});
  }

  openCode() {
    this.nav.push(TreePage, {repo: this.repo.full_name, branch: this.repo.default_branch});
  }

  openCommits() {
    this.nav.push(CommitsPage, {repo: this.repo.full_name});
  }

  openIssuesPage() {
    this.nav.push(IssuesPage, {repo: this.repo.full_name});
  }

  openStargazersPage() {
    this.browser.open(this.repo.html_url + '/stargazers');
  }

  openForksPage() {
    this.nav.push(NetworkPage, {repo: this.repo.full_name});
  }

  openRepo(repo) {
    this.nav.push(RepoPage, {repo: repo})
  }

  openBranchesPage() {
    this.nav.push(BranchesPage, {repo: this.repo.full_name});
  }

  openPullsPage() {
    this.browser.open(this.repo.html_url + '/pulls');
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(RepoPopover, {url: this.repo.url})
    popover.present({ev: event});

    popover.onDidDismiss((value) => {
      if (value !== null) {
        this.nav.push(value, {repo: this.repo.full_name});
      }
    });
  }
}

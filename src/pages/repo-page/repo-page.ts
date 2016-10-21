import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, NavParams, PopoverController} from 'ionic-angular';


import {FileService} from '../../providers/filehttp';
import {GraphApiService} from '../../providers/graphapi';
import {BrowserService} from '../../providers/browser';

import { TreePage } from '../tree-page/tree-page';
import { BranchesPage } from '../branches-page/branches-page';
import { NetworkPage } from '../network-page/network-page';
import { UserPage } from '../user-page/user-page';
import { IssuesPage } from '../issues-page/issues-page';
import { CommitsPage } from '../commits-page/commits-page';

import {RepoPopover} from './repo-popover/repo-popover';

const REPO_QUERY = `
query($username: String!, $reponame: String!) {
  repository(owner: $username, name: $reponame) {
    isFork
    parent {
      owner {
        login
      }
      name
    }
    viewerHasStarred
    viewerSubscription
    viewerCanSubscribe
    name
    owner {
      login
    }
    descriptionHTML
    homepageURL
    issues {
      totalCount
    }
    stargazers {
      totalCount
    }
    forks {
      totalCount
    }
    pullRequests {
      totalCount
    }
  }
}
`;

@Component({
  templateUrl: 'repo-page.html'
})
export class RepoPage {
  public loading: Boolean = true;
  public full_name: string;
  public repo: any = {};
  public readme: string;
  public readmeError: any;
  public branches: number;
  public commits: number;
  public watchingLoading: Boolean = false;
  public starringLoading: Boolean = false;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,
    private popoverCtrl: PopoverController,

    private filehttp: FileService,
    private graphapi: GraphApiService,
    private browser: BrowserService
  ) { }

  ionViewWillEnter() {
    let username = this.params.get('username');
    let reponame = this.params.get('reponame');
    if (username && reponame) {
      this.full_name = username + '/' + reponame
      this.loading = false;
      this.repo['url'] = 'https://api.github.com/repos/' + this.full_name;
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
    let splited = this.full_name.split('/')
    let username = splited[0]
    let reponame = splited[1];
    this.graphapi.request(REPO_QUERY, {username: username, reponame: reponame})
    .subscribe(res => {
      this.loading = false;
      this.repo = res.repository;
      this.getReadMe();
      this.getBranches();
      this.getCommits();
      // console.dir(res);
    }, err => {
      this.loading = false;
      if (err.status === 404) {
        this.filehttp.handleError(err);
      } else {
        this.filehttp.handleError({message: 'Problem with Fetching Repository'});
      }
    })
  }

  getReadMe() {
    let url = '/repos/' + this.getFullName() + '/readme'
    this.filehttp.getFileFromUrl(url, 'html')
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
    let url = '/repos/' + this.getFullName() + '/branches?page=1&per_page=1'
    this.filehttp.getHeaders(url)
    .then(res => {
      this.branches = this.filehttp.getLinkLength(res);
    });
  }

  getCommits() {
    let url = '/repos/' + this.getFullName() + '/commits?page=1&per_page=1'
    this.filehttp.getHeaders(url)
    .then(res => {
      this.commits = this.filehttp.getLinkLength(res);
    });
  }

  getFullName(): string {
    return this.repo.owner.login + '/' +this.repo.name
  }

  watchRepo(repo) {
    this.watchingLoading = true;
    let url = '/repos/' + this.getFullName() + '/subscription'
    this.filehttp.putRequest(url, {subscribed: true})
    .then(res => {
      this.repo.viewerSubscription = 'SUBSRIBED';
      this.watchingLoading = false;
    });
  }

  unWatchRepo(repo) {
    this.watchingLoading = true;
    let url = '/repos/' + this.getFullName() + '/subscription'
    this.filehttp.deleteRequest(url)
    .then(res => {
      this.repo.viewerSubscription = 'UNSUBSCRIBED';
      this.watchingLoading = false;
    });
  }

  starRepo(repo) {
    this.starringLoading = true;
    let url = '/user/starred/' + this.getFullName()
    this.filehttp.putRequest(url, {})
    .then(res => {
      this.repo.viewerHasStarred = true;
      this.starringLoading = false;
    });
  }

  unStarRepo(repo) {
    this.starringLoading = true;
    let url = '/user/starred/' + this.getFullName()
    this.filehttp.deleteRequest(url)
    .then(res => {
      this.repo.viewerHasStarred = false;
      this.starringLoading = false;
    });
  }

  openUser(owner) {
    this.nav.push(UserPage, {username: owner.login});
  }

  openCode() {
    this.nav.push(TreePage, {repo: this.getFullName(), branch: this.repo.default_branch});
  }

  openCommits() {
    this.nav.push(CommitsPage, {repo: this.getFullName()});
  }

  openIssuesPage() {
    this.nav.push(IssuesPage, {username: this.repo.owner.login, reponame: this.repo.name});
  }

  openStargazersPage() {
    this.browser.open(this.repo.html_url + '/stargazers');
  }

  openForksPage() {
    this.nav.push(NetworkPage, {username: this.repo.owner.login, reponame: this.repo.name})
  }

  openRepo(repo) {
    this.nav.push(RepoPage, {username: repo.owner.login, reponame: repo.name})
  }

  openBranchesPage() {
    this.nav.push(BranchesPage, {repo: this.getFullName()});
  }

  openPullsPage() {
    this.nav.push(IssuesPage, {username: this.repo.owner.login, reponame: this.repo.name, query: 'is:pr is:open'});
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(RepoPopover, {url: this.repo.url})
    popover.present({ev: event});

    popover.onDidDismiss((value) => {
      if (value !== null) {
        this.nav.push(value, {repo: this.full_name});
      }
    });
  }
}

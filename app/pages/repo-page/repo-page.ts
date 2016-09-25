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
  private branches: any;
  private pulls: any;
  private contributors: any;
  private collaborators: any;
  private subscription: any;
  private isSubscribed: any;
  private starring: any;
  private isStarring: any;
  private watchingLoading: Boolean = false;
  private starringLoading: Boolean = false;

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
      this.getBranches();
      this.getPulls();
      this.getContributors();
      this.getCollaborators();
      this.checkWatching();
      this.checkStarring();
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

  getBranches() {
    this.octokat.octo.fromUrl(this.repo.url + '/branches')
    .read()
    .then(res => {
      res = JSON.parse(res);
      this.branches = res;
    });
  }

  getPulls() {
    this.octokat.octo.fromUrl(this.repo.url + '/pulls')
    .read()
    .then(res => {
      res = JSON.parse(res);
      this.pulls = res;
    });
  }

  getContributors() {
    this.octokat.octo.fromUrl(this.repo.url + '/contributors')
    .read()
    .then(res => {
      res = JSON.parse(res);
      this.contributors = res;
    });
  }

  getCollaborators() {
    this.octokat.octo.fromUrl(this.repo.url + '/collaborators')
    .read()
    .then(res => {
      res = JSON.parse(res);
      this.collaborators = res;
    });
  }

  checkWatching() {
    if (this.octokat.user) {
      this.octokat.octo.repos(this.repo.owner.login, this.repo.name).subscription
      .read()
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
    this.octokat.octo.repos(repo.owner.login, repo.name).subscription
    .add({subscribed: true})
    .then(res => {
      this.isSubscribed = true;
      this.watchingLoading = false;
    });
  }

  unWatchRepo(repo) {
    this.watchingLoading = true;
    this.octokat.octo.repos(repo.owner.login, repo.name).subscription
    .remove()
    .then(res => {
      this.isSubscribed = false;
      this.watchingLoading = false;
    });
  }

  checkStarring() {
    if (this.octokat.user) {
      this.octokat.octo.me.starred(this.repo.owner.login, this.repo.name)
      .read()
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
    this.octokat.octo.me.starred(this.repo.owner.login, this.repo.name)
    .add()
    .then(res => {
      this.isStarring = true;
      this.starringLoading = false;
    });
  }

  unStarRepo(repo) {
    this.starringLoading = true;
    this.octokat.octo.me.starred(this.repo.owner.login, this.repo.name)
    .remove()
    .then(res => {
      this.isStarring = false;
      this.starringLoading = false;
    });
  }

  openUser(owner) {
    this.nav.push(UserPage, {user: owner});
  }

  openIssuesPage() {
    this.browser.open(this.repo.html_url + '/issues');
  }

  openStargazersPage() {
    this.browser.open(this.repo.html_url + '/stargazers');
  }

  openForksPage() {
    this.browser.open(this.repo.html_url + '/network');
  }

  openWatchersPage() {
    this.browser.open(this.repo.html_url + '/watchers');
  }

  openBranchesPage() {
    this.browser.open(this.repo.html_url + '/branches');
  }

  openPullsPage() {
    this.browser.open(this.repo.html_url + '/pulls');
  }

  openContributorsPage() {
    this.browser.open(this.repo.html_url + '/contributors');
  }

  openCollabaratorsPage() {
    this.browser.open(this.repo.html_url + '/settings/collaboration');
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(Popover);
    popover.present({
      ev: event
    });
  }
}

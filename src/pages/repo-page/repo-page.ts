import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {OctokatService} from '../../services/octokat';
import {FileService} from '../../services/filehttp';
import {BrowserService} from '../../services/browser';

import { ErrorPage } from '../error-page/error-page';
import { UserPage } from '../user-page/user-page';
import { IssuesPage } from '../issues-page/issues-page';
import { CommitsPage } from '../commits-page/commits-page';



@Component({
  templateUrl: 'repo-page.html'
})
export class RepoPage {
  public loading: Boolean = true;
  public repo: any;
  public readme: string;
  public readmeError: any;
  public branches: any;
  public pulls: any;
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
      this.checkWatching();
      this.checkStarring();
    })
    .catch(err => {
      this.loading = false;
      if (err.status === 404) {
        this.nav.push(ErrorPage, {error: err});
      } else {
        this.nav.push(ErrorPage, {error: {message: 'Problem with Fetching Repository'}});
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

  openCode() {
    this.browser.open(this.repo.html_url + '/tree/' + this.repo.default_branch);
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
}
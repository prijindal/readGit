import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import moment from 'moment';

import {OctokatService} from '../../providers/octokat';
import {FileService} from '../../providers/filehttp';
import {BrowserService} from '../../providers/browser';

const DEFAULT_TEXTROWS = 2;

@Component({
  templateUrl: 'issue-page.html'
})
export class IssuePage {
  public issuecomment: string;
  public textarearows: number = DEFAULT_TEXTROWS;
  public loading: Boolean = true;
  public issue: any;
  public comments: any;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,

    public octokat: OctokatService,
    private filehttp: FileService,
    private browser: BrowserService
  ) { }

  ionViewWillEnter() {
    this.issue = this.params.get('issue');
    if (!this.issue) {
      let username = this.params.get('username');
      let reponame = this.params.get('reponame');
      let issuenumber = this.params.get('issuenumber');
      let url = 'https://api.github.com/repos/' + username + '/' + reponame + '/issues/' + issuenumber;
      this.issue = {url: url, number: issuenumber};
     }
    this.getIssue();
    this.getComments();
  }

  getIssue() {
    this.loading = true;
    this.filehttp.getFileFromUrl(this.issue.url, 'html')
    .then(res => {
      this.issue = res.json();
      this.loading = false;
      this.ref.detectChanges();
    })
    .catch(err => {
      this.octokat.handleError(err);
    });
  }

  getComments() {
    this.filehttp.getFileFromUrl(this.issue.url + '/comments?per_page=10000', 'html')
    .then(res => {
      this.loading = false;
      this.comments = res.json();
      this.ref.detectChanges();
    });
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }

  expandTextArea() {
    let length = this.issuecomment.split('\n').length;
    if (length > 2) {
      this.textarearows = length;
    } else {
      this.textarearows = DEFAULT_TEXTROWS;
    }
  }

  commentIssue() {
    this.loading = true;
    let urlSplit = this.issue.url.split('https://api.github.com/repos/')[1].split('/');
    let username = urlSplit[0];
    let reponame = urlSplit[1];
    this.octokat.octo.repos(username, reponame).issues(this.issue.number)
    .comments.create({
      body: this.issuecomment
    })
    .then(res => {
      this.filehttp.getFileFromUrl(res.url, 'html')
      .then(res => {
        this.issuecomment = '';
        this.loading = false;
        this.comments.push(res.json());
        this.ref.detectChanges();
      })
      .catch(err => {
        this.loading = false;
        this.octokat.handleError({
          message: 'There was an Error commenting'
        });
      });
    })
    .catch(err => {
      this.loading = false;
      this.octokat.handleError({
        message: 'There was an Error commenting'
      });
    });
  }
}

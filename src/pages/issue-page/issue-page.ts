import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, NavParams, PopoverController} from 'ionic-angular';

import moment from 'moment';

import {IssuePopover} from './issue-popover/issue-popover';

import {FileService} from '../../providers/filehttp';
import {BrowserService} from '../../providers/browser';

const DEFAULT_TEXTROWS = 2;

@Component({
  selector: 'issue-page',
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
    private popoverCtrl: PopoverController,

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
      this.filehttp.handleError(err);
    });
  }

  getComments() {
    this.filehttp.getFileFromUrl(this.issue.url + '/timeline?per_page=10000', 'html', 'mockingbird-preview')
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
    this.filehttp.postNewRequest(this.issue + '/comments', {
      body: this.issuecomment
    })
    .then(response => {
      let res = response.json();
      this.filehttp.getFileFromUrl(res.url, 'html')
      .then(res => {
        this.issuecomment = '';
        this.loading = false;
        this.comments.push(res.json());
        this.ref.detectChanges();
      })
      .catch(err => {
        this.loading = false;
        this.filehttp.handleError({
          message: 'There was an Error commenting'
        });
      });
    })
    .catch(err => {
      this.loading = false;
      this.filehttp.handleError({
        message: 'There was an Error commenting'
      });
    });
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(IssuePopover, {subsribed: false})
    popover.onDidDismiss((value) => {
      console.log(value);
    })

    popover.present({ev: event})
  }
}

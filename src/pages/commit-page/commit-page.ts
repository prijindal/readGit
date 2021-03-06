import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import moment from 'moment';


import {FileService} from '../../providers/filehttp';
import {BrowserService} from '../../providers/browser';

import {BlobPage} from '../blob-page/blob-page';

@Component({
  templateUrl: 'commit-page.html'
})
export class CommitPage {
  public loading: Boolean = true;
  public commit: any;
  public comments: any;
  public files: any = [];

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,


    private filehttp: FileService,
    private browser: BrowserService
  ) { }

  ionViewWillEnter() {
    this.commit = this.params.get('commit');
    if (!this.commit) {
      let username = this.params.get('username');
      let reponame = this.params.get('reponame');
      let sha = this.params.get('sha');
      let url = 'https://api.github.com/repos/' + username + '/' + reponame + '/commits/' + sha;
      this.commit = {url: url, sha: sha};
     }
    this.getCommit();
    this.getComments();
  }

  getCommit() {
    this.loading = true;
    this.filehttp.getFileFromUrl(this.commit.url, 'html')
    .then(res => {
      this.commit = res.json();
      let message = this.commit.commit.message;
      let messageSpliter = message.indexOf('\n');
      if (messageSpliter >= 0) {
        this.commit.head = message.substr(0, messageSpliter);
        this.commit.body = message.substr(messageSpliter + 2);
      } else {
        this.commit.head = message;
      }
      this.files = [];
      this.commit.files.forEach(file => {
        if (!file.patch) return ;
        let lines = file.patch.split('\n');
        file.lines = [];
        lines.forEach(line => {
          let classes = ['pre-div'];
          if (line[0] === '@') {
            classes.push('grey');
          } else if (line[0] === '-') {
            classes.push('red');
          } else if (line[0] === '+') {
            classes.push('green');
          }
          file.lines.push( { class: classes, content: line });
        });
        this.files.push(file);
      });
      this.loading = false;
      this.ref.detectChanges();
    })
    .catch(err => {
      this.filehttp.handleError(err);
    });
  }

  getComments() {
    this.filehttp.getFileFromUrl(this.commit.url + '/comments?per_page=10000', 'html')
    .then(res => {
      this.comments = res.json();
      this.ref.detectChanges();
    });
  }

  getDate(time) {
    return moment(time).format('LL');
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }

  openBlob(file) {
    this.nav.push(BlobPage, {url: file.contents_url});
  }
}

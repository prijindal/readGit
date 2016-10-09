import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import moment from 'moment';

import {OctokatService} from '../../providers/octokat';
import {FileService} from '../../providers/filehttp';
import {BrowserService} from '../../providers/browser'

@Component({
  templateUrl: 'compare-page.html'
})
export class ComparePage {
  public loading: Boolean = true;
  public compare: any;
  public comments: any;
  public files: any = [];

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,

    private octokat: OctokatService,
    private filehttp: FileService,
    private browser: BrowserService
  ) { }

  ionViewWillEnter() {
    this.compare = this.params.get('compare');
    if (!this.compare) {
      let username = this.params.get('username');
      let reponame = this.params.get('reponame');
      let sha = this.params.get('sha');
      let url = 'https://api.github.com/repos/' + username + '/' + reponame + '/compare/' + sha;
      this.compare = {url: url, sha: sha};
     }
    this.getCompare();
  }

  getCompare() {
    this.loading = true;
    this.filehttp.getFileFromUrl(this.compare.url, 'html')
    .then(res => {
      this.compare = res.json();
      this.files = [];
      this.compare.files.forEach(file => {
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

  getDate(time) {
    return moment(time).format('LL');
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }
}

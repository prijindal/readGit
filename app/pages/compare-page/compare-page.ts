import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, NavParams, PopoverController} from 'ionic-angular';

import * as moment from 'moment';

import OctokatService from '../../services/octokat';
import BrowserService from '../../services/browser';

import { ErrorPage } from '../error-page/error-page';

import { Popover } from './popover/popover';

@Component({
  templateUrl: 'build/pages/compare-page/compare-page.html'
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
    private popoverCtrl: PopoverController,
    private octokat: OctokatService,
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
    this.octokat.octo.fromUrl(this.compare.url, 'html')
    .read()
    .then(res => {
      this.compare = JSON.parse(res);
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
      this.nav.push(ErrorPage, {error: err});
    });
  }

  getDate(time) {
    return moment(time).format('LL');
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(Popover);
    popover.present({
      ev: event
    });
  }
}

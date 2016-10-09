import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import moment from 'moment';

import {FileService} from '../../providers/filehttp';

import {UserPage} from '../user-page/user-page';

@Component({
  selector: 'tag-page',
  templateUrl: 'tag-page.html'
})
export class TagPage {
  loading: Boolean;
  tag: any;

  constructor(
    private nav: NavController,
    private params: NavParams,
    private filehttp: FileService
  ) {}

  ionViewWillEnter() {
    this.tag = this.params.get('tag');
    this.getTag();
  }

  getTag() {
    this.loading = true;
    this.filehttp.getFileFromUrl(this.tag.url)
    .then(res => {
      this.tag = res.json();
      this.loading = false;
    })
  }

  openUser(user) {
    this.nav.push(UserPage, {user: user});
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }
}

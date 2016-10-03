import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import {FileService} from '../../providers/filehttp';

@Component({
  selector: 'blob-page',
  templateUrl: 'blob-page.html'
})
export class BlobPage {
  repo: string;
  path: string;
  branch: string;
  url: string;
  blob: any;

  constructor(
    private nav: NavController,
    private params: NavParams,
    private filehttp: FileService
  ) {}

  ionViewWillEnter() {
    let url = this.params.get('url');
    if (!url) {
      this.repo = this.params.get('repo');
      this.path = this.params.get('path');
      this.branch = this.params.get('branch');
      if (!this.path) {
        this.path = '';
      }
      url = 'https://api.github.com/repos/' + this.repo + '/contents/' + this.path;
      if (this.branch) {
        url = url + '?ref=' + this.branch;
      }
    }
    this.url = url;
    this.getBlob();
  }

  getBlob() {
    this.filehttp.getFileFromUrl(this.url, 'html')
    .then(res => {
      this.blob = res.text();
    })
  }
}

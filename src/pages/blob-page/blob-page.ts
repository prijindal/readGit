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
  blob: any;

  constructor(
    private nav: NavController,
    private params: NavParams,
    private filehttp: FileService
  ) {}

  ionViewWillEnter() {
    this.repo = this.params.get('repo');
    this.path = this.params.get('path');
    this.branch = this.params.get('branch');
    if (!this.path) {
      this.path = '';
    }
    this.getBlob();
  }

  getBlob() {
    let url = 'https://api.github.com/repos/' + this.repo + '/contents/' + this.path;
    if (this.branch) {
      url = url + '?ref=' + this.branch;
    }
    this.filehttp.getFileFromUrl(url, 'html')
    .then(res => {
      this.blob = res.text();
    })
  }
}

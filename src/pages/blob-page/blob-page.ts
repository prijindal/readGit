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
  blob: any;

  constructor(
    private nav: NavController,
    private params: NavParams,
    private filehttp: FileService
  ) {}

  ionViewWillEnter() {
    this.repo = this.params.get('repo');
    this.path = this.params.get('path');
    if (!this.path) {
      this.path = '';
    }
    this.getBlob();
  }

  getBlob() {
    this.filehttp.getFileFromUrl('https://api.github.com/repos/' + this.repo + '/contents/' + this.path, 'html')
    .then(res => {
      this.blob = res.text();
    })
  }
}

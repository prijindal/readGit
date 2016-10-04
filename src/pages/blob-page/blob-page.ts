import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import {FileService} from '../../providers/filehttp';

const IMAGE_EXTENSIONS = [
  'png',
  'jpg',
  'jpeg',
  'gif',
  'bmp'
]

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
  imageUrl: string;

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
    } else {
      let partialUrlArray = url.split('https://api.github.com/repos/')[1];
      let partialUrl = partialUrlArray.split('/contents/');
      this.repo = partialUrl[0];
      this.path = partialUrl[1].split('?ref=')[0];
      this.branch = partialUrl[1].split('?ref=')[1];
    }
    this.url = url;
    this.getBlob();
  }

  getBlob() {
    let extension = this.path.split('.')[this.path.split('.').length - 1].toLowerCase();
    if (IMAGE_EXTENSIONS.indexOf(extension) >= 0) {
      this.filehttp.getFileFromUrl(this.url, 'json')
      .then(res => {
        let data = res.json();
        let src = 'data:image/png;' + data.encoding + ',' + data.content
        this.imageUrl = src;
      })
      return ;
    }
    this.filehttp.getFileFromUrl(this.url, 'html')
    .then(res => {
      this.blob = res.text();
    })
  }
}

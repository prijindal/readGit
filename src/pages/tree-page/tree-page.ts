import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import {FileService} from '../../providers/filehttp';

import {BlobPage} from '../blob-page/blob-page';

@Component({
  selector: 'tree-page',
  templateUrl: 'tree-page.html'
})
export class TreePage {
  repo: string;
  path: string;
  branch: string;
  contents: any;

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
    this.getTree();
  }

  getTree() {
    let url = '/repos/' + this.repo + '/contents/' + this.path;
    if (this.branch) {
      url = url + '?ref=' + this.branch;
    }
    this.filehttp.getFileFromUrl(url)
    .then(res => {
      this.contents = res.json();
    })
  }

  openContent(content) {
    if (content.type === 'file') {
      this.nav.push(BlobPage, {repo: this.repo, path: content.path, branch: this.branch});
    } else if (content.type==='dir') {
      this.nav.push(TreePage, {repo: this.repo, path: content.path, branch: this.branch});
    }
  }
}

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import {OctokatService} from '../../providers/octokat';

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
    private octokat: OctokatService
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
    this.octokat.octo.fromUrl(url)
    .read()
    .then(res => {
      res = JSON.parse(res);
      this.contents = res;
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

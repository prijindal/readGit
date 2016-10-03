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
  contents: any;

  constructor(
    private nav: NavController,
    private params: NavParams,
    private octokat: OctokatService
  ) {}

  ionViewWillEnter() {
    this.repo = this.params.get('repo');
    this.path = this.params.get('path');
    if (!this.path) {
      this.path = '';
    }
    this.getTree();
  }

  getTree() {
    this.octokat.octo.fromUrl('/repos/' + this.repo + '/contents/' + this.path)
    .read()
    .then(res => {
      res = JSON.parse(res);
      this.contents = res;
    })
  }

  openContent(content) {
    if (content.type === 'file') {
      this.nav.push(BlobPage, {repo: this.repo, path: content.path});
    } else if (content.type==='dir') {
      this.nav.push(TreePage, {repo: this.repo, path: content.path});
    }
  }
}

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import {TreePage} from '../tree-page/tree-page';


import {FileService} from '../../providers/filehttp';

@Component({
  selector: 'branches-page',
  templateUrl: 'branches-page.html'
})
export class BranchesPage {
  repo: string;
  branches: any;

  constructor(
  	private nav: NavController,
  	private params: NavParams,
    private filehttp: FileService
  ) {}

  ionViewWillEnter() {
  	this.repo = this.params.get('repo');
  	this.getBranches();
  }

  getBranches() {
  	this.filehttp.getFileFromUrl('/repos/' + this.repo + '/branches')
  	.then(res => {
  		this.branches = res.json();
  	})
    .catch(err => {
      this.filehttp.handleError(err);
    });
  }

  openBranch(branch) {
  	this.nav.push(TreePage, {repo: this.repo, branch: branch.name})
  }
}

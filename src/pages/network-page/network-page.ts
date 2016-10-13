import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import {RepoPage} from '../repo-page/repo-page';

import {FileService} from '../../providers/filehttp';

@Component({
  selector: 'page-network-page',
  templateUrl: 'network-page.html'
})
export class NetworkPage {
	repo: string;
  forks: any;

  constructor(
  	private nav: NavController,
  	private params: NavParams,
  	public filehttp: FileService
  ) {}

  ionViewWillEnter() {
  	this.repo = this.params.get('repo');
  	this.getForks();
  }

  getForks() {
  	this.filehttp.getFileFromUrl('/repos/' + this.repo + '/forks')
  	.then(res => {
  		this.forks = res.json();
  	})
    .catch(err => {
      this.filehttp.handleError(err);
    })
  }

  openFork(fork) {
  	this.nav.push(RepoPage, {reponame: fork.full_name});
  }
}

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import {RepoPage} from '../repo-page/repo-page';

import {OctokatService} from '../../providers/octokat';

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
  	public octokat: OctokatService
  ) {}

  ionViewWillEnter() {
  	this.repo = this.params.get('repo');
  	this.getForks();
  }

  getForks() {
  	this.octokat.octo.fromUrl('/repos/' + this.repo + '/forks')
  	.read()
  	.then(res => {
  		res = JSON.parse(res);
  		this.forks = res;
  	});
  }

  openFork(fork) {
  	this.nav.push(RepoPage, {repo: fork});
  }
}

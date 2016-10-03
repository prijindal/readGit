import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import {OctokatService} from '../../providers/octokat';

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
  	public octokat: OctokatService
  ) {}

  ionViewWillEnter() {
  	this.repo = this.params.get('repo');
  	this.getBranches();
  }

  getBranches() {
  	this.octokat.octo.fromUrl('/repos/' + this.repo + '/branches')
  	.read()
  	.then(res => {
  		res = JSON.parse(res);
  		this.branches = res;
  	});
  }
}

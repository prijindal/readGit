import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import {RepoPage} from '../repo-page/repo-page';

import {FileService} from '../../providers/filehttp';
import {GraphApiService} from '../../providers/graphapi';


let FORKS_QUERY = `
query($username: String!, $reponame: String!) {
  repository(owner: $username, name: $reponame) {
    forks(first: 30) {
      edges {
        node {
          ...fullName
        }
      }
    }
  }
}

fragment fullName on Repository {
  name
  owner {
    login
  }
}
`

@Component({
  selector: 'page-network-page',
  templateUrl: 'network-page.html'
})
export class NetworkPage {
  username: String;
  reponame: String;
  forks: any;

  constructor(
  	private nav: NavController,
  	private params: NavParams,
  	public filehttp: FileService,
    private graphapi: GraphApiService
  ) {}

  ionViewWillEnter() {
    this.username = this.params.get('username');
    this.reponame = this.params.get('reponame');
  	this.getForks();
  }

  getForks() {
    this.graphapi.request(FORKS_QUERY, {username: this.username, reponame: this.reponame})
    .map(res => res.repository.forks)
    .map(res => res.edges.map((f => f.node)))
    .subscribe(res => {
      this.forks = res;
    }, err => {
      this.filehttp.handleError(err);
    })
  }

  openFork(fork) {
    this.nav.push(RepoPage, {username: fork.owner.login, reponame: fork.name});
  }
}

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import {FileService} from '../../providers/filehttp';
import {GraphApiService} from '../../providers/graphapi';

import {ProjectPage} from '../project-page/project-page';

const REPO_QUERY = `
query($username: String!, $reponame:String!) {
  repository(owner: $username, name: $reponame) {
    id
  }
}
`

const CREATE_PROJECT_QUERY = `
mutation(
  $clientMutationId: String!, 
  $ownerId:ID!,
  $name: String!,
  $body:String
) {
  createProject(input: {
    clientMutationId: $clientMutationId, 
    ownerId: $ownerId, 
    name: $name, 
    body: $body
  }) {
    project {
      number
    }
  }
}
`

@Component({
  selector: 'new-project-page',
  templateUrl: 'new-project-page.html'
})
export class NewProjectPage {
  public username: string;
  public reponame: string;
  private ownerId: string;

  public name: string;
  public body: string;

  constructor(
    public nav: NavController,
    private params: NavParams,

    private filehttp: FileService,
    private graphapi: GraphApiService
  ) {}

  ionViewWillEnter() {
    this.username = this.params.get('username');
    this.reponame = this.params.get('reponame');
    this.ownerId = this.params.get('ownerId');
    if (!this.ownerId) {
      this.graphapi.request(REPO_QUERY, {
        username: this.username,
        reponame: this.reponame
      })
      .map(res => res.repository)
      .subscribe(res => {
        this.ownerId = res.id
      }, err => {
        this.filehttp.handleError(err);
      })
    }
  }

  submit() {
    this.graphapi.request(CREATE_PROJECT_QUERY, {
      clientMutationId: this.filehttp.userData.id,
      ownerId: this.ownerId,
      name: this.name,
      body: this.body
    })
    .map(res => res.createProject.project)
    .subscribe(res => {
      this.nav.push(ProjectPage, {
        username: this.username,
        reponame: this.reponame,
        number: res.number
      })
    }, err => {
      this.filehttp.handleError(err);
    })
  }
}

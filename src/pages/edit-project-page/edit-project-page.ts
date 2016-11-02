import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import {FileService} from '../../providers/filehttp';
import {GraphApiService} from '../../providers/graphapi';

import {ProjectsPage} from '../projects-page/projects-page';

const PROJECT_QUERY = `
query($username: String!, $reponame:String! $number:Int!) {
  repository(owner: $username, name: $reponame) {
    id
		project(number: $number) {
      id
      name
      body
      viewerCanEdit
    }
  }
}
`

const UPDATE_PROJECT_QUERY = `
mutation(
  $clientMutationId: String!, 
  $projectId:ID!,
  $name:String!,
  $body:String!,
) {
  updateProject(input: {
    clientMutationId: $clientMutationId, 
    projectId: $projectId,
    name: $name,
    body: $body
  }) {
    project {
      updatedAt
    }
  }
}
`

@Component({
  selector: 'edit-project-page',
  templateUrl: 'edit-project-page.html'
})
export class EditProjectPage {
  public username: string;
  public reponame: string;
  public number: number;
  public project: any;

  constructor(
    public nav: NavController,
    private params: NavParams,

    private filehttp: FileService,
    private graphapi: GraphApiService
  ) {}

  ionViewWillEnter() {
    this.username = this.params.get('username');
    this.reponame = this.params.get('reponame');
    this.number = parseInt(this.params.get('number'));
    this.project = this.params.get('project');
    
    if (!this.project) {
      // Get Project Details
      this.graphapi.request(PROJECT_QUERY, {
        username: this.username,
        reponame: this.reponame,
        number: this.number
      })
      .map(res => res.repository)
      .subscribe(res => {
        this.project = res.project
      }, err => {
        this.filehttp.handleError(err);
      })
    }
  }

  submit() {
    this.graphapi.request(UPDATE_PROJECT_QUERY, {
      clientMutationId: this.filehttp.userData.id,
      projectId: this.project.id,
      name: this.project.name,
      body: this.project.body
    }).subscribe(res => {
      if (this.nav.canGoBack()) {
        this.nav.pop();
      } else {
        this.nav.setRoot(ProjectsPage, {
          username: this.username,
          reponame: this.reponame
        })
      }
    }, err => {
      this.filehttp.handleError(err);
    })
  }
}

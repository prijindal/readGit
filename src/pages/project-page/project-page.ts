import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, Slides, AlertController } from 'ionic-angular';

import moment from 'moment';

import {FileService} from '../../providers/filehttp';
import {GraphApiService} from '../../providers/graphapi';
import {OcticonService} from '../../providers/octicon';

import {UserPage} from '../user-page/user-page';

const COLUMN_EDGE_FRAGMENT = `
fragment columnEdge on ProjectColumnEdge {
  node {
    id
    name
    updatedAt
    cards(first: 30) {
      edges {
        node {
          note
          creator {
            login
          }
          state
          createdAt
          content {
            ...on Issueish {
              id
              number
              author{
                login
              }
              repository {
                name
                owner{
                  login
                }
              }
              title
            }
            ...on Issue {
              state
              assignees(first: 5) {
                edges {
                  node {
                    login
                    avatarURL(size: 40)
                  }
                }
              }
              labels(first: 10) {
                edges {
                  node {
                    name
                    color
                  }
                }
              }
            }
            ...on PullRequest {
              state
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
}
`

const PROJECT_QUERY = `
query($username: String!, $reponame:String! $number:Int!) {
  repository(owner: $username, name: $reponame) {
		project(number: $number) {
      id
      name
      updatedAt
      bodyHTML
      viewerCanEdit
      columns(first: 30) {
        edges {
          ...columnEdge
        }
        pageInfo {
          hasNextPage
          endCursor
        }
        totalCount
      }
    }
  }
}

` + COLUMN_EDGE_FRAGMENT

const ADD_PROJECT_COLUMN_QUERY = `
mutation(
  $clientMutationId: String!, 
  $projectId:ID!,
  $name: String!
) {
  addProjectColumn(input: {
    clientMutationId: $clientMutationId, 
    projectId: $projectId, 
    name: $name
  }) {
    columnEdge {
      ...columnEdge
    }
  }
}
` + COLUMN_EDGE_FRAGMENT

@Component({
  selector: 'project-page',
  templateUrl: 'project-page.html'
})
export class ProjectPage {
  @ViewChild('projectSlider') slider: Slides;
  public username: string;
  public reponame: string;
  public number: number;
  public project: any;

  public projectSlideOptions = {
    pager: true
  }

  constructor(
    private ref: ChangeDetectorRef,
    public nav: NavController,
    private params: NavParams,
    private alertCtrl: AlertController,

    private filehttp: FileService,
    private graphapi: GraphApiService,
    public octicon: OcticonService
  ) {}

  ionViewWillEnter() {
    this.username = this.params.get('username');
    this.reponame = this.params.get('reponame');
    this.number = parseInt(this.params.get('number'));
    this.ref.detach();
    this.ref.detectChanges();
    this.refreshProject();
  }

  ionViewWillLeave() {
    this.ref.reattach();
  }

  refreshProject() {
    let variables = {
      username: this.username,
      reponame: this.reponame,
      number: this.number
    }
    this.graphapi.request(PROJECT_QUERY, variables)
    .map(res => res.repository.project)
    .subscribe(res => {
      this.project = res;
      this.ref.detectChanges();
    }, err => {
      this.filehttp.handleError(err);
    })
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }

  openUser(user) {
    this.nav.push(UserPage, {
      username: user.login
    })
  }

  addProjectColumn() {
    let columnInput = this.alertCtrl.create({
      title: 'Add a column',
      inputs: [
        {
          name: 'name',
          placeholder: 'Column name'
        }
      ],
      buttons:[
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Create Column',
          handler: data => {
            // Add Locally
            let tempId = Date.now()
            this.project.columns.edges.push({
              node: {
                id: tempId,
                name: data.name,
                cards: {
                  edges: [],
                  totalCount: 0
                }
              }
            });
            this.project.columns.totalCount+=1;
            this.ref.detectChanges();
            this.graphapi.request(ADD_PROJECT_COLUMN_QUERY, {
              clientMutationId: this.filehttp.userData.id,
              projectId: this.project.id,
              name: data.name,
            })
            .map(res => res.addProjectColumn.columnEdge)
            .subscribe(res => {
              this.project.columns.edges.forEach(column => {
                if (column.node.id === tempId) {
                  column = res;
                }
              })
              this.ref.detectChanges();
              this.refreshProject();
            }, err => {
              this.filehttp.handleError(err);
            })
          }
        }
      ]
    });
    columnInput.present();
  }
}

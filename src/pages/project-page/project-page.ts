import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, Slides, AlertController, PopoverController } from 'ionic-angular';

import moment from 'moment';

import {FileService} from '../../providers/filehttp';
import {GraphApiService} from '../../providers/graphapi';
import {OcticonService} from '../../providers/octicon';

import {UserPage} from '../user-page/user-page';
import {EditProjectPage} from '../edit-project-page/edit-project-page';

import {ProjectPopover} from './project-popover/project-popover';
import {AddCardPopover} from './add-card-popover/add-card-popover';

const PROJECT_CARD_FRAGMENT = `
fragment projectCard on ProjectCard {
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
`


const CARD_EDGE_FRAGMENT = `
fragment cardEdge on ProjectCardEdge {
  node {
    ...projectCard
  }
}
` + PROJECT_CARD_FRAGMENT

const PROJECT_COLUMN_FRAGMENT = `
fragment projectColumn on ProjectColumn {
  id
  name
  updatedAt
  cards(first: 30) {
    edges {
      ...cardEdge
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
  }
}
` + CARD_EDGE_FRAGMENT

const COLUMN_EDGE_FRAGMENT = `
fragment columnEdge on ProjectColumnEdge {
  node {
    ...projectColumn
  }
}
` + PROJECT_COLUMN_FRAGMENT

const PROJECT_QUERY = `
query($username: String!, $reponame:String! $number:Int!) {
  repository(owner: $username, name: $reponame) {
		project(number: $number) {
      id
      name
      updatedAt
      body
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

const UPDATE_PROJECT_COLUMN_QUERY = `
mutation(
  $clientMutationId: String!, 
  $projectColumnId:ID!,
  $name: String!
) {
  updateProjectColumn(input: {
    clientMutationId: $clientMutationId, 
    projectColumnId: $projectColumnId, 
    name: $name
  }) {
    projectColumn {
	    ...projectColumn
    }
  }
}
` + PROJECT_COLUMN_FRAGMENT

const DELETE_PROJECT_COLUMN_QUERY = `
mutation(
  $clientMutationId: String!, 
  $columnId:ID!
) {
  deleteProjectColumn(input: {
    clientMutationId: $clientMutationId, 
    columnId: $columnId
  }) {
    deletedColumnId
  }
}
`

const ADD_PROJECT_CARD_QUERY = `
mutation(
  $clientMutationId: String!, 
  $projectColumnId:ID!,
  $contentId:ID,
  $note:String
) {
  addProjectCard(input: {
    clientMutationId: $clientMutationId, 
    projectColumnId: $projectColumnId,
    contentId: $contentId,
    note: $note
  }) {
    cardEdge {
      ...cardEdge
    }
  }
}
` + CARD_EDGE_FRAGMENT

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
    private popoverCtrl: PopoverController,

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

  editProject() {
    this.nav.push(EditProjectPage, {
      username: this.username,
      reponame: this.reponame,
      number: this.project.number,
      project: this.project
    });
  }

  showInfo(event) {
    let infoPopover = this.popoverCtrl.create(ProjectPopover, {
      project: this.project
    });
    infoPopover.present({ev: event});
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
              this.project.columns.edges.forEach(edge => {
                if (edge.node.id === tempId) {
                  edge.node = res.node;
                }
              })
              this.ref.detectChanges();
            }, err => {
              this.filehttp.handleError(err);
            })
          }
        }
      ]
    });
    columnInput.present();
  }


  openUser(user) {
    this.nav.push(UserPage, {
      username: user.login
    })
  }

  addColumnCard(column, event) {
    let addCardPopover = this.popoverCtrl.create(AddCardPopover)
    addCardPopover.onDidDismiss(note => {
      if (note) {
        let tempId = Date.now();
        column.node.cards.edges.push({
          node: {
            id: tempId,
            note: note,
            creator: {
              login: this.filehttp.userData.login
            },
            createdAt: new Date()
          }
        });
        column.node.cards.totalCount+=1;
        this.project.columns.edges.forEach(edge => {
          if(edge.node.id === column.node.id) {
            edge.node = column.node
          }
        })
        this.ref.detectChanges();
        this.graphapi.request(ADD_PROJECT_CARD_QUERY, {
          clientMutationId: this.filehttp.userData.id,
          projectColumnId: column.node.id,
          note: note
        })
        .map(res => res.addProjectCard.cardEdge)
        .subscribe(res => {
          column.node.cards.edges.forEach(edge => {
            if (edge.node.id === tempId) {
              edge.node = res.node
            }
          })
          this.project.columns.edges.forEach(edge => {
            if(edge.node.id === column.node.id) {
              edge.node = column.node
            }
          })
          this.ref.detectChanges();
        }, err => {
          this.filehttp.handleError(err);
        })
      }
    })
    addCardPopover.present({ev: event})
  }

  editColumn(column) {
    let editPrompt = this.alertCtrl.create({
      title: 'Edit column',
      inputs:[
        {
          name: 'name',
          placeholder: 'Column name',
          value: column.node.name
        }
      ],
      buttons:[
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Update Column',
          handler: data => {
            column.node.name = data.name
            this.project.columns.edges.forEach(edge => {
              if(edge.node.id === column.node.id) {
                edge = column
              }
            })
            this.ref.detectChanges();
            // Edit column
            this.graphapi.request(UPDATE_PROJECT_COLUMN_QUERY, {
              clientMutationId: this.filehttp.userData.id,
              projectColumnId: column.node.id,
              name: data.name
            })
            .map(res => res.updateProjectColumn.projectColumn)
            .subscribe(res => {
              this.project.columns.edges.forEach(edge => {
                if(edge.node.id === column.node.id) {
                  edge.node = res
                }
              })
              this.ref.detectChanges();
            }, err => {
              this.filehttp.handleError(err)
            })
          }
        },
        {
          text: 'Delete Column',
          handler: data => {
            let columns = []
            this.project.columns.edges.forEach(edge => {
              if(edge.node.id !== column.node.id) {
                columns.push(edge)
              }
            })
            this.project.columns.edges = columns
            this.project.columns.totalCount-=1;
            this.ref.detectChanges();
            // Delete Column
            this.graphapi.request(DELETE_PROJECT_COLUMN_QUERY, {
              clientMutationId: this.filehttp.userData.id,
              columnId: column.node.id,
            })
            .map(res => res.deleteProjectColumn)
            .subscribe(res => {
              let columns = []
              this.project.columns.edges.forEach(edge => {
                if(edge.node.id !== res.deletedColumnId.id) {
                  columns.push(edge)
                }
              })
              this.project.columns.edges = columns
              this.ref.detectChanges();
            })
            console.log(column)
          }
        }
      ]
    })
    editPrompt.present({ev: event});
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }
}

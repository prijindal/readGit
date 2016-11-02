import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, Slides, AlertController, PopoverController, Events } from 'ionic-angular';

import moment from 'moment';

import {FileService} from '../../providers/filehttp';
import {GraphApiService} from '../../providers/graphapi';
import {OcticonService} from '../../providers/octicon';

import {UserPage} from '../user-page/user-page';
import {EditProjectPage} from '../edit-project-page/edit-project-page';

import {ProjectPopover} from './project-popover/project-popover';
import {AddCardPopover} from './add-card-popover/add-card-popover';
import {ProjectCardPopover} from './project-card-popover/project-card-popover';

import {
  PROJECT_QUERY,
  ADD_PROJECT_COLUMN_QUERY,
  UPDATE_PROJECT_COLUMN_QUERY,
  DELETE_PROJECT_COLUMN_QUERY,
  ADD_PROJECT_CARD_QUERY,
  UPDATE_PROJECT_CARD_QUERY,
  DELETE_PROJECT_CARD_QUERY
} from './project-page.queries';

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
    private events: Events,

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

  editColumnCard(column, card, event) {
    let editCardPopover = this.popoverCtrl.create(ProjectCardPopover);

    this.events.subscribe('project-card-edit', events => {
      if (events && events[0]) {
        switch(events[0]) {
          case 'edit':
            this.updateColumnCard(column, card, event)
            break;
          case 'delete':
            this.deleteColumnCard(column, card, event)
            break;
        }
      }
    })

    editCardPopover.onDidDismiss(() => {
      this.events.unsubscribe('project-card-edit')
    })

    editCardPopover.present({ev: event});
  }
  
  updateColumnCard(column, card, event) {
    let editColumnAlert = this.alertCtrl.create({
      title: 'Edit note',
      inputs:[
        {
          name:'note',
          type:'text',
          value:card.node.note
        }
      ],
      buttons:[
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Save note',
          handler: data => {
            column.node.cards.edges.forEach(edge => {
              if (edge.node.id === card.node.id) {
                edge.node.note = data.note
              }
            })
            this.project.columns.edges.forEach(edge => {
              if(edge.node.id === column.node.id) {
                edge.node = column.node
              }
            })
            this.ref.detectChanges();
            this.graphapi.request(UPDATE_PROJECT_CARD_QUERY, {
              clientMutationId: this.filehttp.userData.id,
              projectCardId: card.node.id,
              note: data.note
            })
            .map(res => res.updateProjectCard.projectCard)
            .subscribe(res => {
              column.node.cards.edges.forEach(edge => {
                if (edge.node.id === card.node.id) {
                  edge.node = res
                }
              })
              this.project.columns.edges.forEach(edge => {
                if(edge.node.id === column.node.id) {
                  edge.node = column.node
                }
              })
              this.ref.detectChanges();
            })
          }
        }
      ]
    })
    editColumnAlert.present({ev: event});
  }
  
  deleteColumnCard(column, card, event) {
    let deleteCardAlert = this.alertCtrl.create({
      subTitle: 'Are you sure you want to delete this note' ,
      buttons:[
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Ok',
          handler: () => {
            let edges = []
            column.node.cards.edges.forEach(edge => {
              if (edge.node.id !== card.node.id) {
                edges.push(edge)
              }
            })
            column.node.cards.edges = edges
            column.node.cards.totalCount-=1;
            this.project.columns.edges.forEach(edge => {
              if(edge.node.id === column.node.id) {
                edge.node = column.node
              }
            })
            this.ref.detectChanges();
            this.graphapi.request(DELETE_PROJECT_CARD_QUERY, {
              clientMutationId: this.filehttp.userData.id,
              cardId: card.node.id
            })
            .map(res => res.deleteProjectCard)
            .subscribe(res => {
              let edges = []
              column.node.cards.edges.forEach(edge => {
                if (edge.node.id !== res.deletedCardId) {
                  edges.push(edge)
                }
              })
              column.node.cards.edges = edges
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
        }
      ]
    })
    deleteCardAlert.present({ev: event});
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

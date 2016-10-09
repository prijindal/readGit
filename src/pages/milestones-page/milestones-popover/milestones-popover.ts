import { Component } from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';

import {ReleasesPage} from '../../releases-page/releases-page';
import {FileService} from '../../../providers/filehttp';

@Component({
  template: `
    <ion-list>
      <button
        ion-item
        *ngFor="let stateType of stateTypes"
        (click)="close(stateType.type)"
      >
        <ion-icon item-left [name]="state === stateType.type ? 'checkmark' : ''"></ion-icon>
        <span>{{stateType.name}}</span>
      </button>
      <ion-list-header>Sort By</ion-list-header>
      <button
        ion-item
        *ngFor="let sortType of sortTypes"
        (click)="close(state, sortType.sort, sortType.direction)"
      >
        <ion-icon
          item-left
          [name]="sort === sortType.sort && direction === sortType.direction ? 'checkmark' : ''"
        ></ion-icon>
        <span>{{sortType.name}}</span>
      </button>
    </ion-list>
  `
})
export class MilestonesPopover {
  public stateTypes = [
    {
      type: 'open',
      name: 'View Open'
    },
    {
      type: 'closed',
      name: 'View Closed'
    },
    {
      type: 'all',
      name: 'View All'
    }
  ]
  public sortTypes = [
    {
      sort: 'due_on',
      direction: 'desc',
      name: 'Furthest Due Date'
    },
    {
      sort: 'due_on',
      direction: 'asc',
      name: 'Closed Due Date'
    },
    {
      sort: 'completeness',
      direction: 'asc',
      name: 'Least Complete'
    },
    {
      sort: 'completeness',
      direction: 'desc',
      name: 'Most Complete'
    },
    {
      sort: 'count',
      direction: 'desc',
      name: 'Most Issues'
    },
    {
      sort: 'count',
      direction: 'asc',
      name: 'Least Issues'
    }
  ]
  public state: string;
  public sort: string;
  public direction: string;

  constructor(
    public viewCtrl: ViewController,
    private params: NavParams,
    private filehttp: FileService
  ) {
    this.state = params.get('state');
    this.sort = params.get('sort');
    this.direction = params.get('direction');
  }

  close(state = this.state, sort = this.sort, direction = this.direction) {
    this.state = state;
    this.sort = sort;
    this.direction = direction;
    this.viewCtrl.dismiss({state, sort, direction});
  }
}

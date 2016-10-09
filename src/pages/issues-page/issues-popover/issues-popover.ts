import { Component } from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';

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
    </ion-list>
  `
})
export class IssuesPopover {
  public stateTypes = [
    {
      type: 'is:issue is:open',
      name: 'View Open'
    },
    {
      type: 'is:issue is:closed',
      name: 'View Closed'
    },
    {
      type: 'is:issue ',
      name: 'View All'
    }
  ]
  public state: string;
  public query: string;

  constructor(
    public viewCtrl: ViewController,
    private params: NavParams,
    private filehttp: FileService
  ) {
    this.query = params.get('query');
  }

  close(query) {
    this.viewCtrl.dismiss(query);
  }
}

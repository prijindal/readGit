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
    </ion-list>
  `
})
export class IssuesPopover {
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

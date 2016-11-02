import { Component } from '@angular/core';
import {ViewController, Events} from 'ionic-angular';

@Component({
  template: `
    <ion-list no-lines>
      <button ion-item (click)="close('convert')">
        Convert to issue
      </button>
      <button ion-item (click)="close('edit')">
        Edit note
      </button>
      <button ion-item (click)="close('delete')">
        Delete note
      </button>
    </ion-list>
  `
})
export class ProjectCardPopover {
  constructor(
    public viewCtrl: ViewController,
    private events: Events
  ) {}

  close(event) {
    this.events.publish('project-card-edit', event);
    this.viewCtrl.dismiss();
  }
}

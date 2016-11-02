import { Component } from '@angular/core';
import {ViewController} from 'ionic-angular';

@Component({
  template: `
    <ion-list>
      <ion-item>
        <ion-textarea placeholder="Enter a note" [(ngModel)]="note"></ion-textarea>
      </ion-item>
      <button full ion-button color="light" [disabled]="!note" margin-top (click)="close()">
        Add note
      </button>
    </ion-list>
  `
})
export class AddCardPopover {
  public note: string;

  constructor(
    public viewCtrl: ViewController
  ) {}

  close() {
    this.viewCtrl.dismiss(this.note);
  }
}

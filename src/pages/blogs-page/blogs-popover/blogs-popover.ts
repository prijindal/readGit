import { Component } from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';

@Component({
  template: `
    <ion-list>
      <ion-list-header>Categories</ion-list-header>
      <button
        ion-item
        *ngFor="let type of blogTypes"
        [disabled]="type.path === current"
        (click)="close(type.path)"
      >{{type.name}}</button>
    </ion-list>
  `
})
export class BlogsPopover {
  public blogTypes = [
    {
      name: 'Featured',
      path: ''
    },
    {
      name: 'All',
      path: '/all'
    },
    {
      name: 'Meetups',
      path: '/meetup'
    },
    {
      name: 'Enterprise',
      path: '/enterprise'
    },
    {
      name: 'New Features',
      path: '/ship'
    },
    {
      name: 'Engineering',
      path: '/engineering'
    },
    {
      name: 'Conferences',
      path: '/conferences'
    },
    {
      name: 'Watercooler',
      path: '/watercooler'
    },
    {
      name: 'New Hires',
      path: '/hire'
    },
    {
      name: 'General',
      path: '/general'
    }
  ]
  public current: string;

  constructor(
    public viewCtrl: ViewController,
    private params: NavParams
  ) {
    this.current = params.get('current')
  }

  close(path) {
    this.viewCtrl.dismiss(path);
  }
}

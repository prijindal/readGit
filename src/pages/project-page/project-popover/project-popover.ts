import { Component } from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';

@Component({
  template: `
    <div padding *ngIf="project">
      {{project.body}}
    </div>
  `
})
export class ProjectPopover {
  public project: any;

  constructor(
    public viewCtrl: ViewController,
    private params: NavParams
  ) {
    this.project = params.get('project')
  }

  close(path) {
    this.viewCtrl.dismiss(path);
  }
}

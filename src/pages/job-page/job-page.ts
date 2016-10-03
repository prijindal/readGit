import {Component, ChangeDetectorRef} from '@angular/core';
import {NavParams} from 'ionic-angular';

import {BrowserService} from '../../providers/browser';

@Component({
  templateUrl: 'job-page.html'
})
export class JobPage {
  public loading: Boolean = true;
  public job: any;

  constructor(
    private ref: ChangeDetectorRef,
    private params: NavParams,
    private browser: BrowserService
  ) { }

  ionViewWillEnter() {
    this.job = this.params.get('job');
  }
}

import { Component } from '@angular/core';
import {NavController, NavParams, PopoverController} from 'ionic-angular';

import {MilestonesPopover} from './milestones-popover/milestones-popover';

import {FileService} from '../../providers/filehttp';

const PER_PAGE: number = 5;

@Component({
  selector: 'milestones-page',
  templateUrl: 'milestones-page.html'
})
export class MilestonesPage {
  public loading: Boolean = true;
  public page: number = 1;
  public repo: string;
  public milestones: any = [];
  public state: string = 'open';
  public sort: string = 'due_on';
  public direction: string = 'asc';

  constructor(
    private nav: NavController,
    private params: NavParams,
    private popoverCtrl: PopoverController,

    private filehttp: FileService
  ) { }

  ionViewWillEnter() {
    this.repo = this.params.get('repo');
    this.loading = true;
    if (this.milestones.length === 0) {
      this.page = 1;
      this.getMilestones();
    }
  }

  getMilestones() {
    let url = 'https://api.github.com/repos/' + this.repo + '/milestones'
    url+='?page=' + this.page + '&per_page=' + PER_PAGE
    url+='&state=' + this.state + '&sort=' + this.sort + '&direction=' + this.direction
    return this.filehttp.getFileFromUrl(url, 'html')
    .then(res => {
      let milestones = res.json();
      this.loading = false;
      milestones.forEach(milestone => {
          this.milestones.push(milestone);
      });
      return milestones;
    })
  }

  doInfinite(infiniteScroll) {
    this.page += 1;
    this.getMilestones()
    .then((res) => {
      infiniteScroll.complete();
      if (res.length < PER_PAGE) {
        infiniteScroll.enable(false);
      }
    });
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(MilestonesPopover, {state: this.state, sort: this.sort, direction: this.direction})
    popover.present({ev: event});

    popover.onDidDismiss((params) => {
      this.state = params.state || 'open';
      this.sort = params.sort || 'due_on';
      this.direction = params.direction || 'asc';
      this.loading = true;
      this.milestones = [];
      this.getMilestones();
    });
  }
}

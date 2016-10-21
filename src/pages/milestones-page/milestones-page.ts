import { Component } from '@angular/core';
import {NavController, NavParams, PopoverController} from 'ionic-angular';

import {MilestonesPopover} from './milestones-popover/milestones-popover';

import {IssuesPage} from '../issues-page/issues-page';

import moment from 'moment';

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
    if (this.milestones.length === 0) {
      this.refreshMilestones();
    }
  }

  refreshMilestones() {
    this.loading = true;
    this.page = 1;
    this.getMilestones();
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

  openMilestonePage(milestone) {
    let splitted = this.repo.split('')
    this.nav.push(IssuesPage, {username: splitted[0], reponame: splitted[1], query: 'is:open milestone:' + milestone.title})
  }

  getPercentageComplete(milestone) {
    let total = milestone.closed_issues + milestone.open_issues
    let per = 0;
    if (total) {
      per = (milestone.closed_issues * 100) / total
      per = Math.floor(per)
    }
    return per + '%'
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(MilestonesPopover, {state: this.state, sort: this.sort, direction: this.direction})
    popover.present({ev: event});

    popover.onDidDismiss((params) => {
      if (params) {
        this.state = params.state;
        this.sort = params.sort;
        this.direction = params.direction;
        this.refreshMilestones();
      }
    });
  }
}

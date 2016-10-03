import {Component, ChangeDetectorRef} from '@angular/core';
import {Jsonp, Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {NavController, PopoverController} from 'ionic-angular';

import moment from 'moment';

import {OctokatService} from '../../providers/octokat';

import { JobPage } from '../job-page/job-page';

const PER_PAGE: number = 50;

@Component({
  templateUrl: 'jobs-page.html'
})
export class JobsPage {
  private page: number = 0;
  public loading: Boolean = true;
  public jobs: any = [];

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private popoverCtrl: PopoverController,
    private jsonp: Jsonp,
    private http: Http,
    private octokat: OctokatService
  ) { }

  ionViewWillEnter() {
    this.refreshJobs();
  }

  refreshJobs() {
    this.loading = true;
    this.page = 0;
    this.jobs = [];
    this.getJobs(true)
    .subscribe(() => {
      this.loading = false;
    }, (err) => {
      this.octokat.handleError(err);
    });
  }

  getJobs(shouldRefresh: Boolean = false): Observable<any> {
    let request:Observable<any>;
    if (window.location.protocol === 'file:') {
      request = this.http.get('https://jobs.github.com/positions.json?page=' + this.page)
    } else {
      request = this.jsonp.get('https://jobs.github.com/positions.json?callback=JSONP_CALLBACK&page=' + this.page)
    }
    return request
    .map(res => {
      let jobs = res.json();
      jobs.forEach((job) => {
        this.jobs.push(job);
      });
      this.ref.detectChanges();
      return jobs;
    })
  }

  doInfinite(infiniteScroll) {
    this.page += 1;
    this.getJobs()
    .subscribe((res) => {
      infiniteScroll.complete();
      if (res.length < PER_PAGE) {
        infiniteScroll.enable(false);
      }
    }, (err) => {
      this.octokat.handleError(err);
    });
  }

  openJob(job) {
    this.nav.push(JobPage, {job: job});
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }

  presentPopover(event) {

  }
}

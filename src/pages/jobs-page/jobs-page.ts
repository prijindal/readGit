import {Component, ChangeDetectorRef, ViewChild} from '@angular/core';
import {Jsonp, Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {NavController} from 'ionic-angular';

import moment from 'moment';


import {FileService} from '../../providers/filehttp';
import {AutohideService} from '../../providers/autohide';

import { JobPage } from '../job-page/job-page';

const PER_PAGE: number = 50;

@Component({
  selector: 'jobs-page',
  templateUrl: 'jobs-page.html'
})
export class JobsPage {
  @ViewChild('jobsContent') jobsContent;
  private page: number = 0;
  public searchbarhidden: Boolean = false;
  public search: string;
  public loading: Boolean = true;
  public jobs: any = [];

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private jsonp: Jsonp,
    private http: Http,

    private filehttp: FileService,
    private autohide: AutohideService
  ) { }

  ionViewWillEnter() {
    if (this.jobs.length === 0) {
      this.refreshJobs();
    }
  }

  ionViewDidEnter() {
    this.autohide.init(this.jobsContent, (value) => {
      this.searchbarhidden = value;
    });
  }

  ionViewWillLeave() {
    this.autohide.destroy(this.jobsContent);
  }

  refreshJobs() {
    this.loading = true;
    this.page = 0;
    this.jobs = [];
    this.getJobs(true)
    .subscribe(() => {
      this.loading = false;
    }, (err) => {
      this.filehttp.handleError(err);
    });
  }

  getJobs(shouldRefresh: Boolean = false): Observable<any> {
    let request:Observable<any>;
    let url = 'https://jobs.github.com/positions.json?page=' + this.page
    if (this.search) {
      url += '&search=' + this.search
    }
    if (window.location.protocol === 'file:') {
      request = this.http.get(url)
    } else {
      url+='&callback=JSONP_CALLBACK'
      request = this.jsonp.get(url)
    }
    return request
    .map(res => {
      let jobs = res.json();
      if (shouldRefresh) {
        this.page = 0;
        this.jobs = [];
      }
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
      this.filehttp.handleError(err);
    });
  }

  openJob(job) {
    this.nav.push(JobPage, {job: job});
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }
}

import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, PopoverController} from 'ionic-angular';
import {BlogsPopover} from './blogs-popover/blogs-popover';

import moment from 'moment';

import {OctokatService} from '../../providers/octokat';
import {FileService} from '../../providers/filehttp';

import { BlogPage } from '../blog-page/blog-page';

const PER_PAGE: number = 15;

@Component({
  templateUrl: 'blogs-page.html'
})
export class BlogsPage {
  private page: number = 1;
  public loading: Boolean = true;
  public blogstype: string = '';
  public blogs: any = [];

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private popoverCtrl: PopoverController,
    private filehttp: FileService,
    private octokat: OctokatService
  ) { }

  ionViewWillEnter() {
    if (window.location.protocol === 'file:') {
      this.refreshBlogs();
    } else {
      this.octokat.handleError({
        message: 'Your device can not process this request'
      });
      this.nav.pop();
    }
  }

  refreshBlogs() {
    this.loading = true;
    this.page = 1;
    this.getBlogs(true)
    .then(() => {
      this.loading = false;
    });
  }

  getBlogs(shouldRefresh: Boolean = false) {
    return this.filehttp.getFileFromUrl('https://github.com/blog' + this.blogstype +'.atom?page=' + this.page)
    .then(res => {
      let xmlText = res.text();
      let x2js = new window['X2JS']();
      let parsed = x2js.xml2js( xmlText );
      let blogs = parsed.feed.entry;
      if (shouldRefresh) {
        this.blogs = [];
      }
      blogs.forEach(blog => {
        blog.thumbnail._url = blog.thumbnail._url.replace('s=60', 's=120');
        this.blogs.push(blog);
      });
      this.ref.detectChanges();
      return blogs;
    })
    .catch(err => {
      this.octokat.handleError(err);
    });
  }

  doInfinite(infiniteScroll) {
    this.page += 1;
    this.getBlogs()
    .then((res) => {
      infiniteScroll.complete();
      if (res.length < PER_PAGE) {
        infiniteScroll.enable(false);
      }
    });
  }

  openBlog(blog) {
    this.nav.push(BlogPage, {blog: blog});
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(BlogsPopover, {current: this.blogstype})
    popover.present({ev: event});

    popover.onDidDismiss((value) => {
      if (value !== null) {
        this.blogstype = value;
        this.refreshBlogs();
      }
    });
  }
}

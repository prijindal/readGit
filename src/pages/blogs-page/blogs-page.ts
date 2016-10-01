import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';

import moment from 'moment';

import {OctokatService} from '../../providers/octokat';
import {FileService} from '../../providers/filehttp';

import { BlogPage } from '../blog-page/blog-page';

@Component({
  templateUrl: 'blogs-page.html'
})
export class BlogsPage {
  public loading: Boolean = true;
  public blogs: any;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private filehttp: FileService,
    private alertCtrl: AlertController,
    private octokat: OctokatService
  ) { }

  ionViewWillEnter() {
    this.getBlogs();
  }

  getBlogs(shouldRefresh: Boolean = false) {
    this.filehttp.getFileFromUrl('https://github.com/blog.atom')
    .then(res => {
      let xmlText = res.text();
      let x2js = new window['X2JS']();
      this.blogs = x2js.xml2js( xmlText );
      this.ref.detectChanges();
      return res;
    })
    .catch(err => {
      if (err.status === 0) {
        this.octokat.handleError({
          message: 'It seems like your device can not process this request'
        })
        .then(res => {
          this.nav.pop();
        });
      } else {
        this.octokat.handleError(err);
      }
    });
  }

  openBlog(blog) {
    this.nav.push(BlogPage, {blog: blog});
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }
}

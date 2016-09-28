import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';

import * as moment from 'moment';

import FileService from '../../services/filehttp';

import { ErrorPage } from '../error-page/error-page';
import { BlogPage } from '../blog-page/blog-page';

@Component({
  templateUrl: 'build/pages/blogs-page/blogs-page.html'
})
export class BlogsPage {
  public loading: Boolean = true;
  public blogs: any;

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private filehttp: FileService,
    private alertCtrl: AlertController
  ) { }

  ionViewWillEnter() {
    this.getBlogs();
  }

  getBlogs(shouldRefresh: Boolean = false) {
    return this.filehttp.getFileFromUrl('https://github.com/blog.atom')
    .then(res => {
      let xmlText = res.text();
      let x2js = new window['X2JS']();
      this.blogs = x2js.xml2js( xmlText );
      this.ref.detectChanges();
      return res;
    })
    .catch(err => {
      if (err.status === 0) {
        let errorAlert = this.alertCtrl.create({
          title: 'Unable to Complete Request',
          message: 'It seems like your device can not process this request'
        });
        errorAlert.present()
        .then(res => {
          this.nav.pop();
        });
      } else {
        this.nav.push(ErrorPage, {error: err});
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

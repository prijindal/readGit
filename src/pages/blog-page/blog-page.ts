import {Component, ChangeDetectorRef} from '@angular/core';
import {NavParams} from 'ionic-angular';

@Component({
  templateUrl: 'blog-page.html'
})
export class BlogPage {
  public loading: Boolean = true;
  public blog: any;

  constructor(
    private ref: ChangeDetectorRef,
    private params: NavParams
  ) { }

  ionViewWillEnter() {
    this.blog = this.params.get('blog');
  }
}

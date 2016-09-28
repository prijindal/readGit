import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, NavParams, PopoverController} from 'ionic-angular';

import moment from 'moment';

import OctokatService from '../../services/octokat';
import FileService from '../../services/filehttp';
import BrowserService from '../../services/browser';

import { ErrorPage } from '../error-page/error-page';

import { Popover } from './popover/popover';

@Component({
  templateUrl: 'gist-page.html'
})
export class GistPage {
  public loading: Boolean = true;
  public gist: any;
  public files: any = [];

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,
    private popoverCtrl: PopoverController,
    private octokat: OctokatService,
    private filehttp: FileService,
    private browser: BrowserService
  ) { }

  ionViewWillEnter() {
    this.gist = this.params.get('gist');
    this.getGist();
  }

  getGist() {
    this.octokat.octo.fromUrl(this.gist.url)
    .read()
    .then(res => {
      res = JSON.parse(res);
      this.gist = res;
      for (let key in this.gist.files) {
        if (this.gist.files[key]) {
          this.filehttp.getHtmlFromMarkdown(this.gist.files[key].content)
          .then(res => {
            this.files.push({name: key, html: res.text()});
            this.ref.detectChanges();
          });
        }
      }
    })
    .catch(err => {
      this.nav.push(ErrorPage, {error: err});
    });
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(Popover);
    popover.present({
      ev: event
    });
  }
}

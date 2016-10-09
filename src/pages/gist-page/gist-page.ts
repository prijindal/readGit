import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';

import moment from 'moment';

import {OctokatService} from '../../providers/octokat';
import {FileService} from '../../providers/filehttp';
import {BrowserService} from '../../providers/browser';

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
    private alertCtrl: AlertController,

    private octokat: OctokatService,
    private filehttp: FileService,
    private browser: BrowserService
  ) { }

  ionViewWillEnter() {
    this.gist = this.params.get('gist');
    this.getGist();
  }

  getGist() {
    this.loading = true;
    this.filehttp.getFileFromUrl(this.gist.url)
    .then(response => {
      let res = response.json();
      this.gist = res;
      this.loading = false;
      this.files = [];
      for (let key in this.gist.files) {
        if (this.gist.files[key]) {
          this.filehttp.getHtmlFromMarkdown(this.gist.files[key].content)
          .then(res => {
            this.files.push({name: key, html: res.text(), content: this.gist.files[key].content});
            this.ref.detectChanges();
          });
        }
      }
    })
    .catch(err => {
      this.filehttp.handleError(err);
    });
  }

  deleteGist(event) {
    this.loading = true;
    let prompt = this.alertCtrl.create({
      title: 'Delete this gist?',
      message: 'All the files associated with gist will be deleted',
      buttons:[{
        text: 'No',
        role: 'cancel',
        handler: () => {
          this.loading = false;
        }
      },{
        text: 'Yes',
        handler: () => {
          this.filehttp.deleteRequest(this.gist.url)
          .then(res => {
            this.loading = false;
            this.nav.pop();
          });
        }
      }]
    })
    prompt.present({ev: event})
  }

  editFile(file) {
    this.loading = true;
    let prompt = this.alertCtrl.create({
      title: 'Edit ' + file.name +'?',
      inputs:[{
        name: 'filename',
        placeholder: 'Filename',
        value: file.name
      }, {
        name: 'content',
        placeholder: 'Content',
        value: file.content
      }],
      buttons:[{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          this.loading = false;
        }
      },{
        text: 'Save',
        handler: (data) => {
          let body = {
            files: {}
          }
          body.files[file.name] = {
            filename: data.filename,
            content: data.content
          }
          this.filehttp.patchRequest(this.gist.url, body)
          .then(res => {
            this.loading = false;
            this.getGist();
          });
        }
      }]
    })
    prompt.present({ev: event})
  }

  removeFile(file) {
    this.loading = true;
    let prompt = this.alertCtrl.create({
      title: 'Delete ' + file.name +'?',
      subTitle: 'Are You sure you want to delete this?',
      message: "File cannot be recovered once deleted.",
      buttons:[{
        text: 'No',
        role: 'cancel',
        handler: () => {
          this.loading = false;
        }
      },{
        text: 'Yes',
        handler: () => {
          let body = {
            files: {}
          }
          body.files[file.name] = null;
          this.filehttp.patchRequest(this.gist.url, body)
          .then(res => {
            this.loading = false;
            this.getGist();
          });
        }
      }]
    })
    prompt.present({ev: event})
  }

  goToGist(gist) {
    this.nav.push(GistPage, {gist: gist});
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }
}

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import {FileService} from '../../providers/filehttp';

import {GistPage} from '../gist-page/gist-page';

const DEFAULT_TEXTROWS = 2;

@Component({
  selector: 'gist-new-page',
  templateUrl: 'gist-new-page.html'
})
export class GistNewPage {
  public loading: Boolean = false;
  public description: string;
  public textarearows: number = DEFAULT_TEXTROWS;
  public files = [];

  constructor(
    public nav: NavController,
    private filehttp: FileService
  ) {
    this.files = [{
      _id: new Date().getTime(),
      name: '',
      content: '',
      textarearows: DEFAULT_TEXTROWS
    }]
  }

  expandTextArea() {
    let length = this.description.split('\n').length;
    if (length > 2) {
      this.textarearows = length;
    } else {
      this.textarearows = DEFAULT_TEXTROWS;
    }
  }

  expandContentArea(file) {
    let length = file.content.split('\n').length;
    if (length > 2) {
      file.textarearows = length;
    } else {
      file.textarearows = DEFAULT_TEXTROWS;
    }
  }

  addFile() {
    this.files.push({
      _id: new Date().getTime(),
      name: '',
      content: '',
      textarearows: DEFAULT_TEXTROWS
    })
  }

  removeFile(fileToBeDeleted) {
    if (this.files.length <= 1) return ;
    this.loading = true;
    let files = []
    this.files.forEach(file => {
      if (file._id !== fileToBeDeleted._id) {
        files.push(file);
      }
    });
    this.files = files;
    this.loading = false;
  }

  createGist() {
    this.loading = true;
    let files = {}
    this.files.forEach(file => {
      files[file.name] = {
        content: file.content
      }
    });
    this.filehttp.postNewRequest('/gists',{description: this.description, files: files})
    .then(res => {
      this.loading = false;
      this.nav.push(GistPage, {gist: res.json()});
    });
  }
}

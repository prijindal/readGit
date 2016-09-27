import {Component} from '@angular/core';
import {NavParams} from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/error-page/error-page.html'
})
export class ErrorPage {
  public message: string;
  private error: any;

  constructor(
    private params: NavParams
  ) { }

  ionViewWillEnter() {
    let error = this.params.get('error');
    if (error) {
      this.error = error;
    }
    switch (this.error.status) {
      case 0:
        this.message = 'No Network Connection';
        break;
      case 404:
        this.message = 'Not Found';
        break;
      default:
        this.message = this.error.message || 'Unexpected Error';
    }
    // Check If It is a network problem
  }
}

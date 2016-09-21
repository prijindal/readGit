import {Component} from '@angular/core';
import {NavParams, Platform} from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/error-page/error-page.html'
})
export class ErrorPage {
  public message: string;
  private error: any;
  private sub: any;

  constructor(
    private params: NavParams,
    private platform: Platform
  ) { }

  ionViewWillEnter() {
    this.sub = this.platform.registerBackButtonAction(() => {
      navigator['app'].exitApp();
    });
    let error = this.params.get('error');
    if (error) {
      this.error = error;
    }
    if (typeof this.error.status === 'number') {
      switch (this.error.status) {
        case 0:
          this.message = 'No Network Connection';
          break;
        default:
          this.message = 'Unexpected Error';
      }
    }
    // Check If It is a network problem
  }

  ngOnDestroy() {
    this.sub();
  }
}

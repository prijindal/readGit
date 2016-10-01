import {Injectable} from '@angular/core';
import {AlertController} from 'ionic-angular';

@Injectable()
export class ErrorService {
  constructor(
    private alertCtrl: AlertController
  ) {}

  handleError(message: string) {
    this.alertCtrl.create({
      title: 'Error',
      message: message
    }).present();
  }
}

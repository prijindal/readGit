import {Injectable} from '@angular/core';
import {AlertController} from 'ionic-angular';

@Injectable()
export class ErrorService {
  constructor(
    private alertCtrl: AlertController
  ) {}

  handleError(message: string, title: string = 'Error') {
    return this.alertCtrl.create({
      title: title,
      message: message
    }).present();
  }
}

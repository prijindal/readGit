import {Injectable} from '@angular/core';
import {ToastController} from 'ionic-angular';

import { Toast } from 'ionic-native';

@Injectable()
export class ErrorService {  
  constructor(
    private toastCtrl: ToastController
  ) {}

  handleError(message: string, duration: number = 3000) {
    if (Toast['installed']()) {
      return Toast.show(message, duration.toString(), 'bottom');
    } else {
      let toast = this.toastCtrl.create({
        message: message,
        showCloseButton: true,
        duration: duration
      });
      return toast.present();
    }
  }
}

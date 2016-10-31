import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the NewProjectPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-new-project-page',
  templateUrl: 'new-project-page.html'
})
export class NewProjectPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello NewProjectPage Page');
  }

}

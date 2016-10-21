import { Component, Input } from '@angular/core';
import {NavController} from 'ionic-angular';
import {IssuePage} from '../../pages/issue-page/issue-page';

import moment from 'moment';

@Component({
  selector: 'comment-card',
  templateUrl: 'comment-card.html'
})
export class CommentCard {
  @Input()
  comment: any;

  constructor(
    private nav: NavController
  ) {
    console.log(this.comment)
  }


  openIssue(issue) {
    this.nav.push(IssuePage, {issue: issue})
  }

  invertColor(origcolor: string) {
    let color = parseInt(origcolor, 16);          // convert to integer
    color = 0xFFFFFF ^ color;             // invert three bytes
    let inverseColor = color.toString(16);           // convert to hex
    inverseColor = ("000000" + inverseColor).slice(-6); // pad with leading zeros
    return inverseColor;
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }
}

import { Component, Input } from '@angular/core';
import {NavController} from 'ionic-angular';

import {IssuePage} from '../../pages/issue-page/issue-page';
import {UserPage} from '../../pages/user-page/user-page';
import {OcticonService} from '../../providers/octicon';

@Component({
  selector: 'issue-card',
  templateUrl: 'issue-card.html'
})
export class IssueCard {
  @Input()
  issue: any;

  constructor(
    private nav: NavController,
    public octicon: OcticonService
  ) {}

  openIssue() {
    this.nav.push(IssuePage,{
      username: this.issue.repository.owner.login,
      reponame: this.issue.repository.name,
      issuenumber: this.issue.number
    })
  }

  openUser(user) {
    this.nav.push(UserPage, {
      username: user.login
    })
  }

  invertColor(origcolor: string) {
    let color = parseInt(origcolor, 16);          // convert to integer
    color = 0xFFFFFF ^ color;             // invert three bytes
    let inverseColor = color.toString(16);           // convert to hex
    inverseColor = ("000000" + inverseColor).slice(-6); // pad with leading zeros
    return inverseColor;
  }
}

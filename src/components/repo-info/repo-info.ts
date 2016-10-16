import { Component, Input, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {NavController} from 'ionic-angular';

import {RepoPage} from '../../pages/repo-page/repo-page';

import {OcticonService} from '../../providers/octicon';

@Component({
  selector: 'repo-info',
  templateUrl: 'repo-info.html'
})
export class RepoInfo {
  @Input()
  repo: any;
  descriptionHTML: SafeHtml;

  constructor(
    private nav: NavController,
    private sanitizer: DomSanitizer,
    
    private octicon: OcticonService
  ) {}

  ngOnInit() {
    this.descriptionHTML = this.sanitizer.sanitize(SecurityContext.HTML, this.repo.descriptionHTML)
  }

  openRepository() {
    this.nav.push(RepoPage, {reponame: this.repo.owner.login + '/' + this.repo.name});
  }
}

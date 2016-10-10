import { Injectable } from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

import octicons from 'octicons/build/svg.json';

@Injectable()
export class OcticonService {

  constructor(
    private sanitizer: DomSanitizer
  ) {}

  get(name: string): SafeHtml {
    if (name in octicons) {
      return this.sanitizer.bypassSecurityTrustHtml(octicons[name]);
    } else {
      return null;
    }
  }
}

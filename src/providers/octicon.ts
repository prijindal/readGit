import { Injectable } from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

import octicons from 'octicons/build/svg.json';

@Injectable()
export class OcticonService {

  constructor(
    private sanitizer: DomSanitizer
  ) {}

  get(name: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(octicons[name]);
  }
}

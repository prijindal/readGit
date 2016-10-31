import { Injectable } from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

import octicons from 'octicons/build/data.json';

@Injectable()
export class OcticonService {

  constructor(
    private sanitizer: DomSanitizer
  ) {}

  get(name: string): SafeHtml {
    if (name in octicons) {
      let icon = octicons[name];
      let viewbox = `0 0 ${icon.width} ${icon.height}`
      let path = `<svg xmlns="http://www.w3.org/2000/svg" width="${icon.width}" height="${icon.height}" viewBox="${viewbox}">${icon.path}</svg>`
      return this.sanitizer.bypassSecurityTrustHtml(path);
    } else {
      return null;
    }
  }
}

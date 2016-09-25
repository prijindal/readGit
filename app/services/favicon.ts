import {Injectable} from '@angular/core';

@Injectable()
export class FaviconService {
    set(url) {
      let prevIcon = document.getElementById('favicon');
      if (prevIcon) {
        prevIcon.remove();
      }
      var link = document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.id = 'favicon';
      link.href = url;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
}

export default FaviconService;

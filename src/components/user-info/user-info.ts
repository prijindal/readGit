import { Component, Input } from '@angular/core';

@Component({
  selector: 'user-info',
  templateUrl: 'user-info.html'
})
export class UserInfo {
  @Input()
  user: any;

  constructor() {}
}

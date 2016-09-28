import {Injectable} from '@angular/core';

import { Storage } from '@ionic/storage';

@Injectable()
export class LocalService {
  public storage: Storage;

  constructor() {
    this.storage = new Storage();
  }
}

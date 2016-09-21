import {Injectable} from '@angular/core';

import { Storage, SqlStorage } from 'ionic-angular';

@Injectable()
export class LocalService {
  public storage: Storage;

  constructor() {
    this.storage = new Storage(SqlStorage);
  }
}

export default LocalService;

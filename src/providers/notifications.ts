import { Injectable } from '@angular/core';

import {FileService} from './filehttp';
import async from 'async';

@Injectable()
export class NotificationsService {
  constructor(
    public filehttp: FileService
  ) {}
}

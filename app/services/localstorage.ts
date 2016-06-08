import {Injectable} from '@angular/core'

@Injectable()
export class LocalStorage {
  public get(field:string) {
    return new Promise((resolve, reject) => {
      var saved = localStorage[field]
      if(saved) {
        try {
          var json = JSON.parse(saved)
          resolve(json)
        }
        catch(e) {
          reject(e)
        }
      }
      else {
        reject()
      }
    })
  }
}

import {Injectable} from '@angular/core'

import {GithubHttp} from './githubhttp'
import {LocalStorage} from './localstorage'

@Injectable()
export class UserService {
  constructor(
    private http:GithubHttp,
    private locals:LocalStorage
  ) {
    this.locals.get('/user')
    .then((data) => {
      this.userData = data
    })
  }

  userData:any;
  getUserData() {
    return this.http.get('https://api.github.com/user')
    .map(res=>{
      this.userData = res
      this.updateLocalDatabase()
      return res
    })
  }

  updateLocalDatabase() {
    localStorage['/user'] = JSON.stringify(this.userData)
  }
}

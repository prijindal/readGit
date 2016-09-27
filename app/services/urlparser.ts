import {Injectable} from '@angular/core';

import {HomePage} from '../pages/home-page/home-page';
import {UserPage} from '../pages/user-page/user-page';
import {RepoPage} from '../pages/repo-page/repo-page';
import {IssuesPage} from '../pages/issues-page/issues-page';
import {IssuePage} from '../pages/issue-page/issue-page';
import {CommitsPage} from '../pages/commits-page/commits-page';
import {CommitPage} from '../pages/commit-page/commit-page';
import {ComparePage} from '../pages/compare-page/compare-page';

import BrowserService from './browser';

// If !page, redirect to html_url, otherwise open page with params
declare interface DeepUrl {
  html_url: string;
  page?: any; // A Component
  params?: Object;
};

@Injectable()
export class UrlParser {
  constructor(
    private browser: BrowserService
  ) {}

  parse(url: string): DeepUrl {
    const GITHUB_DOMAIN = 'https://github.com/';
    if (url.indexOf(GITHUB_DOMAIN) !== 0) {
      return {
        html_url: url
      };
    } else {
      let urlArray = url.substring(GITHUB_DOMAIN.length).split('/');
      if (urlArray.length === 0) {
        return {
          html_url: url,
          page: HomePage,
          params: {}
        };
      } else if (urlArray.length === 1) {
        return {
          html_url: url,
          page: UserPage,
          params: {
            username: urlArray[0]
          }
        };
      } else if (urlArray.length === 2) {
        return {
          html_url: url,
          page: RepoPage,
          params: {
            username: urlArray[0],
            reponame: urlArray[1]
          }
        };
      } else {
        if (urlArray[2] === 'issues') {
          if (urlArray.length === 3) {
            return {
              html_url: url,
              page: IssuesPage,
              params: {
                username: urlArray[0],
                reponame: urlArray[1]
              }
            };
          } else if (urlArray.length === 4) {
            return {
              html_url: url,
              page: IssuePage,
              params: {
                username: urlArray[0],
                reponame: urlArray[1],
                issuenumber: urlArray[3]
              }
            };
          }
        } else if (urlArray[2] === 'pulls') {
          if (urlArray.length === 3) {
            return {
              html_url: url,
              page: IssuesPage,
              params: {
                username: urlArray[0],
                reponame: urlArray[1]
              }
            };
          } else if (urlArray.length === 4) {
            return {
              html_url: url,
              page: IssuesPage, // Add Other Options Here
              params: {
                username: urlArray[0],
                reponame: urlArray[1]
              }
            };
          }
        } else if (urlArray[2] === 'pull') {
          if (urlArray.length === 4) {
            return {
              html_url: url,
              page: IssuePage, // Add Other Options Here
              params: {
                username: urlArray[0],
                reponame: urlArray[1],
                issuenumber: urlArray[3]
              }
            };
          }
        } else if (urlArray[2] === 'commits') {
          if (urlArray.length === 3) {
            return {
              html_url: url,
              page: CommitsPage,
              params: {
                username: urlArray[0],
                reponame: urlArray[1]
              }
            };
          } else if (urlArray.length === 4) {
            return {
              html_url: url,
              page: CommitsPage,
              params: {
                username: urlArray[0],
                reponame: urlArray[1],
                branch: urlArray[3]
              }
            };
          }
        } else if (urlArray[2] === 'commit') {
          if (urlArray.length === 3) {
            return {
              html_url: url,
              page: CommitsPage,
              params: {
                username: urlArray[0],
                reponame: urlArray[1]
              }
            };
          } else if (urlArray.length === 4) {
            return {
              html_url: url,
              page: CommitPage,
              params: {
                username: urlArray[0],
                reponame: urlArray[1],
                sha: urlArray[3]
              }
            };
          }
        } else if (urlArray[2] === 'compare') {
          if (urlArray.length === 4) {
            return {
              html_url: url,
              page: ComparePage,
              params: {
                username: urlArray[0],
                reponame: urlArray[1],
                sha: urlArray[3]
              }
            };
          }
        }
      }
    }
    return {
      html_url: url
    };
  }

  openUrl(nav, url: string) {
    let link: DeepUrl = this.parse(url);
    if (!link.page) {
      this.browser.open(link.html_url);
    } else {
      nav.push(link.page, link.params);
    }
  }
}

export default UrlParser;

import {Injectable} from '@angular/core';

import {HomePage} from '../pages/home-page/home-page';
import {UserPage} from '../pages/user-page/user-page';
import {RepoPage} from '../pages/repo-page/repo-page';
import {IssuesPage} from '../pages/issues-page/issues-page';
import {IssuePage} from '../pages/issue-page/issue-page';
import {CommitsPage} from '../pages/commits-page/commits-page';
import {CommitPage} from '../pages/commit-page/commit-page';
import {ComparePage} from '../pages/compare-page/compare-page';
import {BlogsPage} from '../pages/blogs-page/blogs-page';
import {BlobPage} from '../pages/blob-page/blob-page';
import {TreePage} from '../pages/tree-page/tree-page';
import {BranchesPage} from '../pages/branches-page/branches-page';
import {NetworkPage} from '../pages/network-page/network-page';
import {ReleasesPage} from '../pages/releases-page/releases-page';

import {BrowserService} from './browser';

// If !page, redirect to html_url, otherwise open page with params
export declare interface DeepUrl {
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
    const GITHUB_DOMAIN = 'github.com/';
    if (url.indexOf(GITHUB_DOMAIN) < 0) {
      return {
        html_url: url
      };
    } else {
      let urlArray = url.substring(url.indexOf(GITHUB_DOMAIN) + GITHUB_DOMAIN.length).split('/');
      if (urlArray.length === 0) {
        return {
          html_url: url,
          page: HomePage,
          params: {}
        };
      } else if (urlArray.length === 1) {
        if (urlArray[0] === 'blog') {
          return {
            html_url: url,
            page: BlogsPage
          };
        } else {
          return {
            html_url: url,
            page: UserPage,
            params: {
              username: urlArray[0]
            }
          };
        }
      } else if (urlArray.length === 2) {
        return {
          html_url: url,
          page: RepoPage,
          params: {
            reponame: urlArray[0] + '/' + urlArray[1]
          }
        };
      } else {
        if (urlArray[2] === 'issues') {
          if (urlArray.length === 3) {
            var params = {
              username: urlArray[0],
              reponame: urlArray[1]
            }
            let query = urlArray[2].split('?q=')
            if (query.length === 1) {
              params['query'] = query[1];
            }
            return {
              html_url: url,
              page: IssuesPage,
              params: params
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
                reponame: urlArray[1],
                query: 'is:pr is:open'
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
        } else if (urlArray[2] === 'blob') {
          if (urlArray.length > 4) {
            let path = '';
            for (let i = 4;i < urlArray.length; ++i) {
              path+=urlArray[i] + '/';
            }
            return {
              html_url: url,
              page: BlobPage,
              params: {
                repo: urlArray[0] + '/' + urlArray[1],
                path: path,
                branch: urlArray[3]
              }
            };
          }
        } else if (urlArray[2] === 'tree') {
          if (urlArray.length >= 4) {
            let path;
            if (urlArray.length > 4) {
              path = urlArray[4];
            } else {
              path = '';
            }
            return {
              html_url: url,
              page: TreePage,
              params: {
                repo: urlArray[0] + '/' + urlArray[1],
                path: path,
                branch: urlArray[3]
              }
            };
          }
        } else if (urlArray[2] === 'branches') {
          return {
            html_url: url,
            page: BranchesPage,
            params: {
              repo: urlArray[0] + '/' + urlArray[1]
            }
          }
        } else if (urlArray[2] === 'network') {
          return {
            html_url: url,
            page: NetworkPage,
            params: {
              repo: urlArray[0] + '/' + urlArray[1]
            }
          }
        } else if (urlArray[2] === 'releases') {
          return {
            html_url: url,
            page: ReleasesPage,
            params: {
              repo: urlArray[0] + '/' + urlArray[1]
            }
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

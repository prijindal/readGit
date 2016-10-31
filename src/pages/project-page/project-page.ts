import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';

import moment from 'moment';

import {FileService} from '../../providers/filehttp';
import {GraphApiService} from '../../providers/graphapi';
import {OcticonService} from '../../providers/octicon';

import {UserPage} from '../user-page/user-page';

const PROJECT_QUERY = `
query($username: String!, $reponame:String! $number:Int!) {
  repository(owner: $username, name: $reponame) {
		project(number: $number) {
      name
      updatedAt
      bodyHTML
      viewerCanEdit
      columns(first: 30) {
        edges {
          node {
            name
            updatedAt
            cards(first: 30) {
              edges {
                node {
                  note
                  creator {
                    login
                  }
                  state
                  createdAt
                  content {
                    ...on Issueish {
                      id
                      number
                      author{
                        login
                      }
                      repository {
                        name
                        owner{
                          login
                        }
                      }
                      title
                    }
										...on Issue {
                      state
                      assignees(first: 5) {
                        edges {
                          node {
                            login
                            avatarURL(size: 40)
                          }
                        }
                      }
                      labels(first: 10) {
                        edges {
                          node {
                            name
                            color
                          }
                        }
                      }
                    }
                    ...on PullRequest {
                      state
                    }
                  }
                }
              }
              pageInfo {
                hasNextPage
                endCursor
              }
              totalCount
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
        totalCount
      }
    }
  }
}
`
@Component({
  selector: 'project-page',
  templateUrl: 'project-page.html'
})
export class ProjectPage {
  @ViewChild('projectSlider') slider: Slides;
  public username: string;
  public reponame: string;
  public number: number;
  public project: any;

  public projectSlideOptions = {
    pager: true
  }

  constructor(
    private ref: ChangeDetectorRef,
    public nav: NavController,
    private params: NavParams,

    private filehttp: FileService,
    private graphapi: GraphApiService,
    public octicon: OcticonService
  ) {}

  ionViewWillEnter() {
    this.username = this.params.get('username');
    this.reponame = this.params.get('reponame');
    this.number = parseInt(this.params.get('number'));
    this.refreshProject();
  }

  refreshProject() {
    let variables = {
      username: this.username,
      reponame: this.reponame,
      number: this.number
    }
    this.graphapi.request(PROJECT_QUERY, variables)
    .map(res => res.repository.project)
    .subscribe(res => {
      this.project = res;
      this.ref.detectChanges();
    }, err => {
      this.filehttp.handleError(err);
    })
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }

  openUser(user) {
    this.nav.push(UserPage, {
      username: user.login
    })
  }
}

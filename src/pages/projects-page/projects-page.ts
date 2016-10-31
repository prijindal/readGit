import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {Observable} from 'rxjs';
import moment from 'moment';

import {FileService} from '../../providers/filehttp';
import {GraphApiService} from '../../providers/graphapi';

import {ProjectPage} from '../project-page/project-page';
import {NewProjectPage} from '../new-project-page/new-project-page';

const PER_PAGE: number = 5;

const PROJECTS_QUERY = `
query($username: String!, $reponame:String!, $PER_PAGE:Int, $after:String) {
  repository(owner: $username, name: $reponame) {
    id
		projects(first: $PER_PAGE, after: $after) {
      edges {
        node {
          name
          number
          updatedAt
          bodyHTML
          viewerCanEdit
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
`

@Component({
  templateUrl: 'projects-page.html'
})
export class ProjectsPage {
  public loading: Boolean = true;
  public projects: any = [];
  public username: string;
  public reponame: string;
  private ownerId: string;
  private endCursor: string = "";

  constructor(
    private ref: ChangeDetectorRef,
    private nav: NavController,
    private params: NavParams,

    private filehttp: FileService,
    private graphapi: GraphApiService
  ) {}

  ionViewWillEnter() {
    this.username = this.params.get('username');
    this.reponame = this.params.get('reponame');
    this.refreshProjects();
  }

  refreshProjects() {
    this.loading = true;
    this.endCursor = "";
    this.getProjects(true)
    .subscribe(() => {
      this.loading = false;
    }, err => {
      this.filehttp.handleError(err);
    });
  }

  getProjects(shouldRefresh: Boolean = false): Observable<any> {
    let variables = {
      username: this.username,
      reponame: this.reponame,
      PER_PAGE: PER_PAGE
    }
    if (this.endCursor) {
      variables['after'] = this.endCursor
    }
    return this.graphapi.request(PROJECTS_QUERY, variables)
    .map(res => {
      this.ownerId = res.repository.id
      return res.repository.projects
    })
    .map(res => {
      if (shouldRefresh) {
        this.projects = [];
      }
      res.edges.forEach((project) => {
        this.projects.push(project.node);
      });
      this.ref.detectChanges();
      this.endCursor = res.pageInfo.endCursor;
      return res;
    })
  }

  doInfinite(infiniteScroll) {
    this.getProjects()
    .subscribe(res => {
      infiniteScroll.complete();
      if (!res.pageInfo.hasNextPage) {
        infiniteScroll.enable(false);
      }
    }, err => {
      this.filehttp.handleError(err);
    })
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }

  openProject(project) {
    this.nav.push(ProjectPage, {
      username: this.username,
      reponame: this.reponame,
      number: project.number
    });
  }

  createProject() {
    this.nav.push(NewProjectPage, {
      username: this.username,
      reponame: this.reponame,
      ownerId: this.ownerId
    })
  }
}

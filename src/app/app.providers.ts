import {GithubLogin} from '../providers/githublogin';
import {ErrorService} from '../providers/error';
import {LocalService} from '../providers/local';
import {NotificationsService} from '../providers/notifications';
import {EventParser} from '../providers/eventparser';
import {FaviconService} from '../providers/favicon';
import {BrowserService} from '../providers/browser';
import {FileService} from '../providers/filehttp';
import {GraphApiService} from '../providers/graphapi';
import {UrlParser} from '../providers/urlparser';
import {AutohideService} from '../providers/autohide';
import {OcticonService} from '../providers/octicon';

export const APP_PROVIDERS = [
    LocalService,
    ErrorService,
    NotificationsService,
    GithubLogin,
    FaviconService,
    EventParser,
    BrowserService,
    FileService,
    UrlParser,
    OcticonService,
    AutohideService,
    GraphApiService
]

import {GithubLogin} from '../providers/githublogin';
import {ErrorService} from '../providers/error';
import {LocalService} from '../providers/local';
import {OctokatService} from '../providers/octokat';
import {NotificationsService} from '../providers/notifications';
import {EventParser} from '../providers/eventparser';
import {FaviconService} from '../providers/favicon';
import {BrowserService} from '../providers/browser';
import {FileService} from '../providers/filehttp';
import {UrlParser} from '../providers/urlparser';

export const APP_PROVIDERS = [
    LocalService,
    ErrorService,
    OctokatService,
    NotificationsService,
    GithubLogin,
    FaviconService,
    EventParser,
    BrowserService,
    FileService,
    UrlParser
]

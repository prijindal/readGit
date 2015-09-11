angular.module('readGit')
        .factory('eventString', [function() {


            var getString = function(event) {
                var string = event.actor.login + ' '
                switch (event.type) {
                    case 'CommitCommentEvent':
                        string+='commented on commit '
                        string+=event.repo.name+'@'
                        string+=event.payload.comment.commit_id.slice(0, 10)
                        break;

                    case 'CreateEvent':
                        string+='created '
                        string+=event.payload.ref_type+' '
                        if (event.payload.ref_type=='branch') {
                            string+=event.payload.ref+' at '
                        };
                        string+=event.repo.name
                        break;
                    
                    case 'DeleteEvent':
                        string+='deleted '
                        string+=event.payload.ref_type+' '
                        string+=event.payload.ref+' at '
                        string+=event.repo.name
                        break;
                    
                    case 'DeploymentEvent':
                        string+=''
                        break;
                    
                    case 'DeploymentStatusEvent':
                        string+=''
                        break;
                    
                    case 'DownloadEvent':
                        string+=''
                        break;
                    
                    case 'FollowEvent':
                        string+=''
                        break;
                    
                    case 'ForkEvent':
                        string+='forked '
                        string+=event.repo.name+' to '
                        string+=event.payload.forkee.full_name
                        break;
                    
                    case 'ForkApplyEvent':
                        string+=''
                        break;
                    
                    case 'GistEvent':
                        string+=''
                        break;
                    
                    case 'GollumEvent':
                        string+=event.payload.pages[0].action+' the '
                        string+=event.repo.name + ' '
                        string+='wiki'
                        break;                  

                    case 'IssueCommentEvent':
                        string+= 'commented on issue '
                        string+= event.repo.name
                        string+= '#' + event.payload.issue.number
                        break;

                    case 'IssuesEvent':
                        string+= event.payload.action + ' '
                        string+= 'issue '
                        string+= event.repo.name
                        string+= '#' + event.payload.issue.number
                        break;

                    case 'MemberEvent':
                        string+= event.payload.action + ' '
                        string+= event.payload.member.login
                        string+= ' to '
                        string+= event.repo.name
                        break;

                    case 'MembershipEvent':
                        string+=''
                        break;

                    case 'PageBuildEvent':
                        string+=''
                        break;

                    case 'PublicEvent':
                        string+='made '
                        string+=event.repo.name+' '
                        string+='public'
                        break;

                    case 'PullRequestEvent':
                        string+=event.payload.action + ' '
                        string+='pull request '
                        string+=event.repo.name+'#'
                        string+=event.payload.number
                        break;

                    case 'PullRequestReviewCommentEvent':
                        string+= 'commented on pull request '
                        string+= event.repo.name
                        string+= '#' + event.payload.pull_request.number
                        break;
                    
                    case 'PushEvent':
                        string+= 'pushed to '
                        string+= event.payload.ref.split('/')[event.payload.ref.split('/').length - 1]
                        string+= ' at '
                        string+= event.repo.name
                        break;   

                    case 'ReleaseEvent':
                        string+=''
                        break;

                    case 'RepositoryEvent':
                        string+=''
                        break;

                    case 'StatusEvent':
                        string+=''
                        break;

                    case 'TeamAddEvent':
                        string+=''
                        break;

                    case 'WatchEvent':
                        string+= 'starred '
                        string+= event.repo.name
                        break;

                    default:
                        string='UNKNOWN EVENT'
                }

                return string
            }

            return {
                getString:getString
            }
        }])

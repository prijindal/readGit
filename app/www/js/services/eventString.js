angular.module('readGit')
        .factory('eventString', [function() {


            var getString = function(event) {
                var string = event.actor.login + ' '
                switch (event.type) {
                     case 'MemberEvent':
                         string+= event.payload.action + ' '
                         string+= event.payload.member.login
                         string+= ' to '
                         string+= event.repo.name
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
                     case 'WatchEvent':
                         string+= 'starred '
                         string+= event.repo.name
                         break;
                     case 'PushEvent':
                         string+= 'pushed to '
                         string+= event.payload.ref.split('/')[event.payload.ref.split('/').length - 1]
                         string+= ' at '
                         string+= event.repo.name
                         break;
                     default:
                         string+='Some Default String'
                }

                return string
            }

            return {
                getString:getString
            }
        }])

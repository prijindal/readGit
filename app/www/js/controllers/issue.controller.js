angular.module('readGit')
.controller('issueController',
['$stateParams','issue.info','issue.comments','issue.events',
function($stateParams, issueInfo,comments,events){
    var self = this;
    self.issue = {}
    var username = $stateParams.username;
    var reponame = $stateParams.reponame;
    var issueNumber = $stateParams.number;
    self.username = username;
    self.reponame = reponame;
    self.reponame = issueNumber;
    issueInfo.getData(username, reponame,issueNumber, function(data) {
        console.log(data)
        self.issue.info = data;
    })
    comments.getData(username, reponame,issueNumber, function(data) {
        console.log(data)
        self.issue.comments = data;
    })
    events.getData(username, reponame,issueNumber, function(data) {
        console.log(data)
        self.issue.events = data;
    })
}])

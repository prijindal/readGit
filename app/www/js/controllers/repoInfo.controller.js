angular.module('readGit')
.controller('repoInfoController',
['$stateParams','repoInfo','repo.watchers','repo.stargazers','repo.forks','repo.issues','repo.pulls','repo.contributors',
function($stateParams,repoInfo, watchers, stargazers, forks, issues, pulls, contributors) {
    var self = this;
    self.repoInfo = {}
    var username = $stateParams.username;
    var reponame = $stateParams.reponame;
    self.username = username;
    self.reponame = reponame;
    repoInfo.getData(username, reponame, function(data) {
        console.log(data)
        self.repoInfo = data;
    })
    watchers.getData(username, reponame, function(data) {
        console.log(data)
        self.repoInfo.watchers = data
    })
    stargazers.getData(username, reponame, function(data) {
        console.log(data)
        self.repoInfo.stargazers = data
    })
    forks.getData(username, reponame, function(data) {
        console.log(data)
        self.repoInfo.forks = data
    })
    issues.getData(username, reponame, function(data) {
        console.log(data)
        self.repoInfo.issues = data
    })
    pulls.getData(username, reponame, function(data) {
        console.log(data)
        self.repoInfo.pulls = data
    })
    contributors.getData(username, reponame, function(data) {
        console.log(data)
        total = 0
        for (var i = 0; i < data.length; i++) {
            total+=data[i].contributions
        }
        self.repoInfo.contributors = data
        self.repoInfo.contributors.total = total
    })
}])

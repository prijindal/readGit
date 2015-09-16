angular.module('readGit')
.controller('repoInfoController',['$stateParams','repoInfo', function($stateParams,repoInfo) {
    var self = this;
    var username = $stateParams.username;
    var reponame = $stateParams.reponame;
    self.username = username;
    self.reponame = reponame;
    repoInfo.getData(username, reponame, function(data) {
        console.log(data)
        self.repoInfo = data;
    })
}])

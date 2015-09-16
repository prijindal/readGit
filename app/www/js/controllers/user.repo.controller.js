angular.module('readGit')
.controller('userRepoController', ['$stateParams','userRepoInfo', function($stateParams,userRepos) {
    var self = this;
    var username = $stateParams.username
    this.username = username;
    userRepos.getData(username, function(data) {
        self.repoDetails = data
    })
}])

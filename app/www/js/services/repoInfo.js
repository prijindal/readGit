angular.module('readGit')
.service('repoInfo', ['$http', function($http) {
    var getData = function(username,reponame, cb) {
        $http.get('https://api.github.com/repos/'+username+'/'+reponame)
            .success(function(data) {
                cb(data)
            })
    }
    return {
        getData:getData
    }
}])

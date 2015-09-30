angular.module('readGit')
.service('issue.info', ['$http', function($http) {
    var getData = function(username,reponame,number, cb) {
        $http.get('https://api.github.com/repos/'+username+'/'+reponame+'/issues/'+number)
            .success(function(data) {
                cb(data)
            })
    }
    return {
        getData:getData
    }
}])
.service('issue.comments', ['$http', function($http) {
    var getData = function(username,reponame,number, cb) {
        $http.get('https://api.github.com/repos/'+username+'/'+reponame+'/issues/'+number+'/comments')
            .success(function(data) {
                cb(data)
            })
    }
    return {
        getData:getData
    }
}])
.service('issue.events', ['$http', function($http) {
    var getData = function(username,reponame,number, cb) {
        $http.get('https://api.github.com/repos/'+username+'/'+reponame+'/issues/'+number+'/events')
            .success(function(data) {
                cb(data)
            })
    }
    return {
        getData:getData
    }
}])

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
.service('repo.watchers', ['$http', function($http) {
    var getData = function(username,reponame, cb) {
        $http.get('https://api.github.com/repos/'+username+'/'+reponame+'/watchers')
            .success(function(data) {
                cb(data)
            })
    }
    return {
        getData:getData
    }
}])
.service('repo.stargazers', ['$http', function($http) {
    var getData = function(username,reponame, cb) {
        $http.get('https://api.github.com/repos/'+username+'/'+reponame+'/stargazers')
            .success(function(data) {
                cb(data)
            })
    }
    return {
        getData:getData
    }
}])
.service('repo.forks', ['$http', function($http) {
    var getData = function(username,reponame, cb) {
        $http.get('https://api.github.com/repos/'+username+'/'+reponame+'/forks')
            .success(function(data) {
                cb(data)
            })
    }
    return {
        getData:getData
    }
}])
.service('repo.issues', ['$http', function($http) {
    var getData = function(username,reponame, cb) {
        $http.get('https://api.github.com/repos/'+username+'/'+reponame+'/issues')
            .success(function(data) {
                cb(data)
            })
    }
    return {
        getData:getData
    }
}])
.service('repo.pulls', ['$http', function($http) {
    var getData = function(username,reponame, cb) {
        $http.get('https://api.github.com/repos/'+username+'/'+reponame+'/pulls')
            .success(function(data) {
                cb(data)
            })
    }
    return {
        getData:getData
    }
}])

.service('repo.contributors', ['$http', function($http) {
    var getData = function(username,reponame, cb) {
        $http.get('https://api.github.com/repos/'+username+'/'+reponame+'/contributors')
            .success(function(data) {
                cb(data)
            })
    }
    return {
        getData:getData
    }
}])

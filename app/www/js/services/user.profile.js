angular.module('readGit')
.service('userProfile', ['$http', function($http){
    var getData = function(username, cb) {
        $http.get('https://api.github.com/users/'+username)
            .success(function(data) {
                cb(data)
            })
    }
    return {
        getData:getData
    }
}])
.service('userStarred', ['$http', function($http){
    var getData = function(username, cb) {
        $http.get('https://api.github.com/users/'+username+'/starred')
            .success(function(data) {
                cb(data)
            })
    }
    return {
        getData:getData
    }
}])
.service('userRepoInfo', ['$http', function($http){
    var getData = function(username, cb) {
        $http.get('https://api.github.com/users/'+username+'/repos')
            .success(function(data) {
                cb(data)
            })
    }
    return {
        getData:getData
    }
}])
.service('userFollowersInfo', ['$http', function($http){
    var getData = function(username, cb) {
        $http.get('https://api.github.com/users/'+username+'/followers')
            .success(function(data) {
                cb(data)
            })
    }
    return {
        getData:getData
    }
}])
.service('userFollowingInfo', ['$http', function($http){
    var getData = function(username, cb) {
        $http.get('https://api.github.com/users/'+username+'/following')
            .success(function(data) {
                cb(data)
            })
    }
    return {
        getData:getData
    }
}])
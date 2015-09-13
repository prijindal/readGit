angular.module('readGit')
.service('search', ['$http', function($http){
    var details = {}
    var saveData = function(query, callback) {
        if (!details.query) {
            details.query = {}
        };
        $http.get('https://api.github.com/search/repositories?q='+query)
            .success(function(data) {
                details.query.repos = data
                if (details.query.users) {
                    callback(details.query)
                };
            })
        $http.get('https://api.github.com/search/users?q='+query)
            .success(function(data) {
                details.query.users = data
                if (details.query.repos) {
                    callback(details.query)
                };
            })
    }

    var getData = function(query) {
        return details.query
    }

    var clearData = function() {
        details = {}
    }

    return {
        saveData:saveData,
        getData:getData,
        clearData:clearData
    }
}])
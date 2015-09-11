angular.module('readGit')
.controller('reposController', ['$location', 'userRepos','credentials', function($location, userRepos, credentials){
    var self = this;
    var getNewData = function() {
        console.log('Getting new data')
        userRepos.saveData(credentials.get().username, function(data) {
            self.userRepos = data
            console.log('new data loaded')
        })
    }

    if(credentials.isLoggedIn()) {
        console.log(credentials.get());
        self.userRepos = userRepos.getData()
        getNewData()
    }
    else {
        $location.path('/login')
    }
}])
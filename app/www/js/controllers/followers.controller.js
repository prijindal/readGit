angular.module('readGit')
.controller('followersController', ['$location', 'userFollowers','credentials', function($location, userFollowers, credentials){
    var self = this;
    var getNewData = function() {
        console.log('Getting new data')
        userFollowers.saveData(credentials.get().username, function(data) {
            self.userFollowers = data
            console.log('new data loaded')
        })
    }

    if(credentials.isLoggedIn()) {
        console.log(credentials.get());
        self.userFollowers = userFollowers.getData()
        getNewData()
    }
    else {
        $location.path('/login')
    }
}])